import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { loadMessagesFromSupabase, sendMessageToSupabase } from "@/services/chatService";

interface ChatContextType {
  messages: Message[];
  sendMessage: (orderId: string, text: string, partnerId?: string) => Promise<void>;
  loadMessages: (orderId: string) => Promise<void>;
  orderMessages: (orderId: string) => Message[];
  hasNewMessages: (orderId: string, lastReadTime?: Date) => boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useAuth();

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    console.log("Setting up messages subscription in ChatContext");
    
    // Initial load of all messages
    const loadAllMessagesData = async () => {
      const loadedMessages = await loadMessagesFromSupabase();
      setMessages(loadedMessages);
      console.log(`Loaded ${loadedMessages.length} messages initially`);
    };
    
    loadAllMessagesData();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log("New message received via realtime:", payload);
          const newMessage = payload.new;
          
          if (!newMessage) {
            console.error("Received payload with no new message data");
            return;
          }
          
          // Add the new message to our state
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) {
              console.log("Message already exists in state, skipping");
              return prev;
            }
            
            console.log("Adding new message to state:", newMessage);
            return [...prev, {
              id: newMessage.id,
              orderId: newMessage.order_id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_name,
              senderRole: newMessage.sender_role,
              text: newMessage.text,
              createdAt: new Date(newMessage.created_at),
            }];
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        setIsSubscribed(status === 'SUBSCRIBED');
      });
      
    // Return cleanup function
    return () => {
      console.log("Removing message subscription");
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [user]);

  // Filter messages by order ID
  const orderMessages = (orderId: string): Message[] => {
    if (!orderId) return [];
    return messages.filter(message => message.orderId === orderId);
  };

  // Check if there are new messages since last read time
  const hasNewMessages = (orderId: string, lastReadTime?: Date): boolean => {
    if (!lastReadTime || !orderId) return false;
    
    return messages.some(message => 
      message.orderId === orderId && 
      message.createdAt > lastReadTime && 
      message.senderId !== user?.id
    );
  };

  // Load messages for a specific order
  const loadMessages = async (orderId: string) => {
    if (!user || !orderId) {
      console.log("Cannot load messages: user not logged in or no orderId");
      return;
    }

    try {
      console.log(`Loading messages for order ${orderId}`);
      
      const orderSpecificMessages = await loadMessagesFromSupabase(orderId);
      
      // Update messages for this order, keep other messages
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.orderId !== orderId);
        return [...filteredMessages, ...orderSpecificMessages];
      });
      
      console.log(`Loaded ${orderSpecificMessages.length} messages for order ${orderId}`);
    } catch (error) {
      console.error("Error loading messages for order:", error);
      toast({
        title: "Error loading messages",
        description: "Could not load chat messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Send a new message
  const sendMessage = async (orderId: string, text: string, partnerId?: string) => {
    if (!user || !text.trim() || !orderId) {
      console.log("Cannot send message: missing user, text, or orderId");
      return;
    }

    try {
      console.log(`Sending message to order ${orderId}: ${text}`);
      
      // Create optimistic update with temporary ID
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempId,
        orderId,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        text: text.trim(),
        createdAt: new Date(),
      };
      
      // Add optimistic update
      setMessages(prev => [...prev, optimisticMessage]);

      // Send the actual message to Supabase
      const success = await sendMessageToSupabase(
        orderId,
        user.id,
        user.name,
        user.role,
        text.trim()
      );

      if (!success) {
        // Remove the optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        toast({
          title: "Message not sent",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Message sent successfully to Supabase");
        
        // If realtime subscription isn't working, manually reload messages
        if (!isSubscribed) {
          console.log("Realtime subscription not active, manually reloading messages");
          setTimeout(() => loadMessages(orderId), 1000);
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        loadMessages,
        orderMessages,
        hasNewMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

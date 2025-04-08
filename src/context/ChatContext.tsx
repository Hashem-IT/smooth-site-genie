
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { MOCK_MESSAGES } from "@/utils/chatUtils";
import { sendMessageToSupabase } from "@/services/chatService";

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
  const { user } = useAuth();

  // Auto-load all messages when user logs in
  useEffect(() => {
    if (user) {
      console.log("User logged in, loading all messages");
      loadAllMessages();
      const cleanupSubscription = setupMessageSubscription();
      return cleanupSubscription;
    } else {
      // Reset messages when user logs out
      setMessages([]);
    }
  }, [user]);

  // Function to load messages for all orders
  const loadAllMessages = async () => {
    if (!user) return;

    try {
      console.log("Loading all messages");
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        // Don't throw error, just use mock data or empty array
        setMessages(MOCK_MESSAGES);
        return;
      }

      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} messages`);
        const formattedMessages: Message[] = data.map(item => ({
          id: item.id,
          orderId: item.order_id,
          senderId: item.sender_id,
          senderName: item.sender_name,
          senderRole: item.sender_role as "business" | "driver",
          text: item.text,
          createdAt: new Date(item.created_at),
        }));

        setMessages(formattedMessages);
      } else {
        console.log("No messages found in the database");
      }
    } catch (error: any) {
      console.error("Error loading messages:", error.message);
      // Fall back to mock data
      setMessages(MOCK_MESSAGES);
    }
  };

  // Set up realtime subscription for messages
  const setupMessageSubscription = () => {
    console.log("Setting up message subscription");
    
    // Create a specific channel for messages updates
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        },
        (payload: any) => {
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
              senderRole: newMessage.sender_role as "business" | "driver",
              text: newMessage.text,
              createdAt: new Date(newMessage.created_at),
            }];
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
      
    // Return cleanup function
    return () => {
      console.log("Removing message subscription");
      supabase.removeChannel(channel);
    };
  };

  // Add this function to filter messages by order ID
  const orderMessages = (orderId: string): Message[] => {
    return messages.filter(message => message.orderId === orderId);
  };

  // Check if there are new messages since last read
  const hasNewMessages = (orderId: string, lastReadTime?: Date): boolean => {
    if (!lastReadTime) return false;
    
    return messages.some(message => 
      message.orderId === orderId && 
      message.createdAt > lastReadTime && 
      message.senderId !== user?.id
    );
  };

  // Load messages for a specific order
  const loadMessages = async (orderId: string) => {
    if (!user) return;

    try {
      console.log(`Loading messages for order ${orderId}`);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error loading messages for order:", error);
        // Don't throw error, use existing messages or empty array
        return;
      }

      if (data && data.length > 0) {
        console.log(`Loaded ${data.length} messages for order ${orderId}`);
        const orderSpecificMessages: Message[] = data.map(item => ({
          id: item.id,
          orderId: item.order_id,
          senderId: item.sender_id,
          senderName: item.sender_name,
          senderRole: item.sender_role as "business" | "driver",
          text: item.text,
          createdAt: new Date(item.created_at),
        }));

        // Update only messages for this order, keep other messages
        setMessages(prev => [
          ...prev.filter(msg => msg.orderId !== orderId),
          ...orderSpecificMessages
        ]);
      } else {
        console.log(`No messages found for order ${orderId}`);
      }
    } catch (error: any) {
      console.error("Error loading messages for order:", error.message);
    }
  };

  // Send a new message
  const sendMessage = async (orderId: string, text: string, partnerId?: string) => {
    if (!user || !text.trim()) {
      console.log("Cannot send message: user not logged in or text empty");
      return;
    }

    try {
      console.log(`Sending message to order ${orderId}: ${text}`);
      
      // Add message to local state immediately for better UX
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

      // Use the dedicated function to send message to Supabase
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
        console.log("Message sent successfully");
        // The real message will come through the subscription
      }
      
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "Message not sent",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow the UI to handle the error
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

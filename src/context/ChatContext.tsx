
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface ChatContextType {
  messages: Message[];
  sendMessage: (orderId: string, text: string) => Promise<void>;
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
      setupMessageSubscription();
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
        throw error;
      }

      if (data) {
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
      }
    } catch (error: any) {
      console.error("Error loading messages:", error.message);
      // Don't show toast for this error as it appears to be related to permissions
      // and we'll handle it gracefully
    }
  };

  // Set up realtime subscription for messages
  const setupMessageSubscription = () => {
    console.log("Setting up message subscription");
    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        },
        (payload: any) => {
          console.log("New message received:", payload);
          const newMessage = payload.new;
          setMessages(prev => [...prev, {
            id: newMessage.id,
            orderId: newMessage.order_id,
            senderId: newMessage.sender_id,
            senderName: newMessage.sender_name,
            senderRole: newMessage.sender_role as "business" | "driver",
            text: newMessage.text,
            createdAt: new Date(newMessage.created_at),
          }]);
        }
      )
      .subscribe();
      
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
        throw error;
      }

      if (data) {
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
      }
    } catch (error: any) {
      console.error("Error loading messages for order:", error.message);
    }
  };

  // Send a new message
  const sendMessage = async (orderId: string, text: string) => {
    if (!user || !text.trim()) {
      console.log("Cannot send message: user not logged in or text empty");
      return;
    }

    try {
      console.log(`Sending message to order ${orderId}: ${text}`);
      
      // Create a new message object with all required fields
      const newMessage = {
        order_id: orderId,
        sender_id: user.id,
        sender_name: user.name,
        sender_role: user.role,
        text: text.trim(),
        created_at: new Date().toISOString(),
      };

      // Insert directly into messages table without any joins to users/profiles
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("Message sent successfully");
      
      // Add message to local state for immediate display
      const localMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID until we get the real one from subscription
        orderId,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        text: text.trim(),
        createdAt: new Date(),
      };
      
      setMessages(prev => [...prev, localMessage]);
      
    } catch (error: any) {
      console.error("Error sending message:", error.message);
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


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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  // Function to filter messages by order ID
  const orderMessages = (orderId: string): Message[] => {
    return messages.filter(message => message.orderId === orderId);
  };

  // Load messages for a specific order
  const loadMessages = async (orderId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedMessages: Message[] = data.map(item => ({
          id: item.id,
          orderId: item.order_id,
          senderId: item.sender_id,
          senderName: item.sender_name,
          senderRole: item.sender_role as "business" | "driver",
          text: item.text,
          createdAt: new Date(item.created_at),
        }));

        setMessages(prev => {
          // Filter out existing messages for this order
          const filteredMessages = prev.filter(msg => msg.orderId !== orderId);
          // Add new messages
          return [...filteredMessages, ...formattedMessages];
        });
      }
    } catch (error: any) {
      console.error("Error loading messages:", error.message);
      toast({
        title: "Error",
        description: "Could not load chat messages.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time message updates
  useEffect(() => {
    if (user) {
      // Subscribe to new messages
      const messagesSubscription = supabase
        .channel('messages_channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        }, (payload: any) => {
          const newMessage = payload.new;
          
          // Add the new message to state
          setMessages(prev => [...prev, {
            id: newMessage.id,
            orderId: newMessage.order_id,
            senderId: newMessage.sender_id,
            senderName: newMessage.sender_name,
            senderRole: newMessage.sender_role as "business" | "driver",
            text: newMessage.text,
            createdAt: new Date(newMessage.created_at),
          }]);
          
          // If the message is not from the current user, show a toast notification
          if (newMessage.sender_id !== user.id) {
            toast({
              title: "New message",
              description: `New message from ${newMessage.sender_name}`,
            });
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [user]);

  // Send a new message
  const sendMessage = async (orderId: string, text: string) => {
    if (!user || !text.trim()) return;

    try {
      const newMessage = {
        order_id: orderId,
        sender_id: user.id,
        sender_name: user.name,
        sender_role: user.role,
        text: text.trim(),
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('messages')
        .insert(newMessage);

      if (error) {
        throw error;
      }
      
      // No need to update local state as it will be done by the subscription
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast({
        title: "Error",
        description: "Could not send message.",
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

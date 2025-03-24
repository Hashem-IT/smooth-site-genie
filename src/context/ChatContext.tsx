
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

interface ChatContextType {
  messages: Message[];
  sendMessage: (orderId: string, text: string) => Promise<void>;
  loadMessages: (orderId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();

  // Nachrichten für eine bestimmte Bestellung laden
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

        setMessages(formattedMessages);
      }
    } catch (error: any) {
      console.error("Fehler beim Laden der Nachrichten:", error.message);
    }
  };

  useEffect(() => {
    if (user) {
      // Echtzeit-Abonnement für neue Nachrichten
      const messagesSubscription = supabase
        .channel('messages_channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages'
        }, (payload: any) => {
          // Nachricht zum lokalen Zustand hinzufügen
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
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [user]);

  // Neue Nachricht senden
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
    } catch (error: any) {
      console.error("Fehler beim Senden der Nachricht:", error.message);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        loadMessages,
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


import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Message, UserRole, Order } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";
import { loadChatMessagesForOrder, loadChatMessagesForCompany, sendChatMessage, markMessagesAsRead } from "@/services/chatService";

// Define chat message type for improved chat_messages table
export interface ChatMessage {
  id: string;
  orderId: string | null;
  senderId: string;
  recipientId: string | null;
  messageText: string;
  isRead: boolean;
  createdAt: Date;
}

interface ChatContextType {
  chatMessages: Record<string, ChatMessage[]>; // key can be orderId or companyId (for driver-company chats)
  sendMessage: (params: {
    orderId: string | null;
    recipientId: string | null;
    messageText: string;
  }) => Promise<void>;
  markMessagesRead: (conversationKey: string) => Promise<void>;
  loadMessagesForOrder: (orderId: string) => Promise<void>;
  loadMessagesForCompany: (driverId: string, companyId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  // Load messages for a specific order chat
  const loadMessagesForOrder = useCallback(async (orderId: string) => {
    if (!user) return;
    try {
      const messages = await loadChatMessagesForOrder(orderId);
      setChatMessages(prev => ({ ...prev, [orderId]: messages }));
    } catch (error: any) {
      console.error("Failed to load chat messages for order:", error);
      toast({
        title: "Error",
        description: "Failed to load chat messages for order.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Load messages for a company-driver chat (without order)
  const loadMessagesForCompany = useCallback(async (driverId: string, companyId: string) => {
    if (!user) return;
    try {
      const messages = await loadChatMessagesForCompany(driverId, companyId);
      setChatMessages(prev => ({ ...prev, [companyId]: messages }));
    } catch (error: any) {
      console.error("Failed to load chat messages for company chat:", error);
      toast({
        title: "Error",
        description: "Failed to load chat messages for company chat.",
        variant: "destructive",
      });
    }
  }, [user]);

  // Send message to specific conversation (order chat or company chat)
  const sendMessage = useCallback(async ({ 
    orderId, 
    recipientId, 
    messageText 
  }: { 
    orderId: string | null; 
    recipientId: string | null; 
    messageText: string;
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recipientId && !orderId) {
      toast({
        title: "Error",
        description: "Missing recipient or order information.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Send the message
      const success = await sendChatMessage(
        user.id,
        recipientId!,
        messageText,
        orderId
      );

      if (!success) throw new Error("Failed to send message");

      // Refresh messages optimistically
      if (orderId) {
        await loadMessagesForOrder(orderId);
      } else if (recipientId) {
        await loadMessagesForCompany(user.id, recipientId);
      }
    } catch (error: any) {
      console.error("Failed to send chat message:", error);
      toast({
        title: "Error",
        description: "Failed to send chat message.",
        variant: "destructive",
      });
      throw error;
    }
  }, [user, loadMessagesForOrder, loadMessagesForCompany]);

  // Mark messages in a conversation as read
  const markMessagesRead = useCallback(async (conversationKey: string) => {
    if (!user || !conversationKey) return;
    
    try {
      // Determine if the conversation key is an order ID or company ID
      const isOrderId = conversationKey.includes('-'); // UUID format check
      
      const success = await markMessagesAsRead(user.id, conversationKey, isOrderId);
      
      if (!success) {
        console.error("Error marking messages as read");
        return;
      }
      
      // Update UI optimistically
      setChatMessages(prev => {
        const messages = prev[conversationKey] || [];
        return {
          ...prev,
          [conversationKey]: messages.map(msg => ({
            ...msg,
            isRead: msg.recipientId === user.id ? true : msg.isRead
          }))
        };
      });
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  }, [user]);

  // Setup realtime subscription for chat messages
  useEffect(() => {
    if (!user) {
      setChatMessages({});
      return;
    }

    const channel = supabase
      .channel(`chat-user-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        // Handle new message
        const newMessage = payload.new;
        if (!newMessage) return;
        
        // Determine the conversation key (orderId or senderId)
        const convKey = newMessage.order_id || newMessage.sender_id || '';
        
        setChatMessages(prev => {
          const existing = prev[convKey] || [];
          return {
            ...prev,
            [convKey]: [...existing, {
              id: newMessage.id,
              orderId: newMessage.order_id,
              senderId: newMessage.sender_id,
              recipientId: newMessage.recipient_id,
              messageText: newMessage.message_text,
              isRead: newMessage.is_read ?? false,
              createdAt: new Date(newMessage.created_at)
            }]
          };
        });
        
        // Play a notification sound or show a toast notification
        toast({
          title: "New Message",
          description: "You have received a new message",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const value: ChatContextType = {
    chatMessages,
    sendMessage,
    markMessagesRead,
    loadMessagesForOrder,
    loadMessagesForCompany,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChat must be used within a ChatProvider");
  return context;
};

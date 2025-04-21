
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Message, UserRole, Order } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

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
  chatMessages: Record<string, ChatMessage[]>; // key can be orderId or companyId (for driver-company chats, we use companyId as string)
  sendMessage: (params: {
    orderId: string | null;
    recipientId: string | null;
    messageText: string;
  }) => Promise<void>;
  markMessagesRead: (conversationKey: string) => Promise<void>;
  loadMessagesForOrder: (orderId: string) => Promise<void>;
  loadMessagesForCompany: (companyId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});

  // Load messages for a specific order chat
  const loadMessagesForOrder = useCallback(async (orderId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = (data || []).map(msg => ({
        id: msg.id,
        orderId: msg.order_id,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        messageText: msg.message_text,
        isRead: msg.is_read ?? false,
        createdAt: new Date(msg.created_at),
      }));

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

  // Load messages for a company-driver chat (e.g. driver-company conversation)
  // companyId here is the businessId (string)
  const loadMessagesForCompany = useCallback(async (companyId: string) => {
    if (!user) return;
    try {
      // We treat the company chat as messages between the driver and the company without order
      // That means order_id is NULL and messages where sender or recipient is either user or companyId
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .is('order_id', null)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${companyId}),and(sender_id.eq.${companyId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = (data || []).map(msg => ({
        id: msg.id,
        orderId: null,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        messageText: msg.message_text,
        isRead: msg.is_read ?? false,
        createdAt: new Date(msg.created_at),
      }));

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
  const sendMessage = useCallback(async ({ orderId, recipientId, messageText }: { orderId: string | null; recipientId: string | null; messageText: string }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          order_id: orderId,
          sender_id: user.id,
          recipient_id: recipientId,
          message_text: messageText,
        });

      if (error) throw error;

      // Refresh messages optimistically
      if (orderId) {
        await loadMessagesForOrder(orderId);
      } else if (recipientId) {
        await loadMessagesForCompany(recipientId);
      }
    } catch (error: any) {
      console.error("Failed to send chat message:", error);
      toast({
        title: "Error",
        description: "Failed to send chat message.",
        variant: "destructive",
      });
    }
  }, [user, loadMessagesForOrder, loadMessagesForCompany]);

  // Mark messages in a conversation as read (given conversation key: orderId or companyId)
  const markMessagesRead = useCallback(async (conversationKey: string) => {
    if (!user) return;

    try {
      if (!conversationKey) return;

      // Determine if conversation is order chat or company chat by key format (UUID)
      // If conversationKey is an orderId (UUID), update messages with order_id = conversationKey
      // If company chat (recipientId), update messages with order_id null and sender or recipient = user or company
      const updates = [];

      // Mark unread messages as read where recipient is current user
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('order_id', conversationKey)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Optional: reload messages
      if (conversationKey) {
        if (conversationKey.includes('-')) {
          // Likely orderId
          await loadMessagesForOrder(conversationKey);
        } else {
          // Possible companyId
          await loadMessagesForCompany(conversationKey);
        }
      }
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  }, [user, loadMessagesForOrder, loadMessagesForCompany]);

  // Setup realtime subscription for chat messages relevant to this user
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
        // On new message for this user, reload related conversation messages
        const newMessage = payload.new;
        const orderKey = newMessage.order_id ?? newMessage.sender_id ?? '';
        setChatMessages(prev => {
          const convKey = newMessage.order_id || newMessage.sender_id || '';
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


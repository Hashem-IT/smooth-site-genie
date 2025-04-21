
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/context/ChatContext";

// Load chat messages for a given order id
export const loadChatMessagesForOrder = async (orderId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading chat messages for order:", error);
    return [];
  }
  return (data || []).map(msg => ({
    id: msg.id,
    orderId: msg.order_id,
    senderId: msg.sender_id,
    recipientId: msg.recipient_id,
    messageText: msg.message_text,
    isRead: msg.is_read ?? false,
    createdAt: new Date(msg.created_at),
  }));
};

// Load chat messages between a driver and a company (businessId), orderId should be null
export const loadChatMessagesForCompany = async (driverId: string, companyId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .is('order_id', null)
    .or(`and(sender_id.eq.${driverId},recipient_id.eq.${companyId}),and(sender_id.eq.${companyId},recipient_id.eq.${driverId})`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error loading company chat messages:", error);
    return [];
  }
  return (data || []).map(msg => ({
    id: msg.id,
    orderId: null,
    senderId: msg.sender_id,
    recipientId: msg.recipient_id,
    messageText: msg.message_text,
    isRead: msg.is_read ?? false,
    createdAt: new Date(msg.created_at),
  }));
};

// Send a message in a chat (order or company chat)
export const sendChatMessage = async (
  senderId: string,
  recipientId: string | null,
  messageText: string,
  orderId: string | null = null
): Promise<boolean> => {
  const { error } = await supabase
    .from('chat_messages')
    .insert({
      order_id: orderId,
      sender_id: senderId,
      recipient_id: recipientId,
      message_text: messageText,
    });

  if (error) {
    console.error("Error sending chat message:", error);
    return false;
  }
  return true;
};


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

// Load chat messages between a driver and a company
export const loadChatMessagesForCompany = async (driverId: string, companyId: string): Promise<ChatMessage[]> => {
  console.log(`Loading chat messages between driver ${driverId} and company ${companyId}`);
  
  // We need to fetch messages where either:
  // 1. Driver sends to company: sender=driverId, recipient=companyId
  // 2. Company sends to driver: sender=companyId, recipient=driverId
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
  
  console.log(`Found ${data?.length || 0} messages between driver and company`);
  
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
  console.log("Sending chat message with params:", { senderId, recipientId, messageText, orderId });
  
  try {
    const { data, error } = await supabase
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
    
    console.log("Message sent successfully");
    return true;
  } catch (err) {
    console.error("Exception sending chat message:", err);
    return false;
  }
};

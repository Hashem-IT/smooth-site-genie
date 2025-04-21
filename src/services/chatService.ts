
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/context/ChatContext";

// Load chat messages for a given order id
export const loadChatMessagesForOrder = async (orderId: string): Promise<ChatMessage[]> => {
  try {
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
  } catch (error) {
    console.error("Exception loading chat messages for order:", error);
    return [];
  }
};

// Load chat messages between a driver and a company
export const loadChatMessagesForCompany = async (driverId: string, companyId: string): Promise<ChatMessage[]> => {
  try {
    console.log(`Loading chat messages between driver ${driverId} and company ${companyId}`);
    
    // We need to fetch messages where either:
    // 1. Driver sends to company: sender=driverId, recipient=companyId
    // 2. Company sends to driver: sender=companyId, recipient=driverId
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .is('order_id', null)
      .or(`sender_id.eq.${driverId},recipient_id.eq.${driverId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error loading company chat messages:", error);
      return [];
    }
    
    // Filter messages that involve both the driver and company
    const filteredData = data?.filter(msg => 
      (msg.sender_id === driverId && msg.recipient_id === companyId) || 
      (msg.sender_id === companyId && msg.recipient_id === driverId)
    ) || [];
    
    console.log(`Found ${filteredData.length} messages between driver and company`);
    
    return filteredData.map(msg => ({
      id: msg.id,
      orderId: null,
      senderId: msg.sender_id,
      recipientId: msg.recipient_id,
      messageText: msg.message_text,
      isRead: msg.is_read ?? false,
      createdAt: new Date(msg.created_at),
    }));
  } catch (error) {
    console.error("Exception loading company chat messages:", error);
    return [];
  }
};

// Send a message in a chat (order or company chat)
export const sendChatMessage = async (
  senderId: string,
  recipientId: string,
  messageText: string,
  orderId: string | null = null
): Promise<boolean> => {
  console.log("Sending chat message with params:", { senderId, recipientId, messageText, orderId });
  
  if (!senderId || !recipientId || !messageText) {
    console.error("Missing required parameters for sending message");
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        order_id: orderId,
        sender_id: senderId,
        recipient_id: recipientId,
        message_text: messageText,
        is_read: false
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

// Mark messages as read for a conversation
export const markMessagesAsRead = async (
  userId: string,
  conversationKey: string,
  isOrderId: boolean = true
): Promise<boolean> => {
  try {
    let query = supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);
    
    if (isOrderId) {
      query = query.eq('order_id', conversationKey);
    } else {
      // For company chat, find messages where the other party is conversationKey
      query = query.is('order_id', null).eq('sender_id', conversationKey);
    }
    
    const { error } = await query;
    
    if (error) {
      console.error("Error marking messages as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception marking messages as read:", error);
    return false;
  }
};

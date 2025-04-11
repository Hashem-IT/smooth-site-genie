
import { Message, UserRole } from "@/types";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { MOCK_MESSAGES } from "@/utils/chatUtils";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "easydrop-messages";

// Load messages from local storage (fallback only)
export const loadMessages = (): Message[] => {
  return getFromStorage<Message[]>(STORAGE_KEY, MOCK_MESSAGES);
};

// Save messages to local storage (for offline support)
export const saveMessages = (messages: Message[]): void => {
  saveToStorage(STORAGE_KEY, messages);
};

// Create a new message object
export const createNewMessage = (
  user: User | null,
  orderId: string,
  text: string
): Message | null => {
  if (!user) {
    toast({
      title: "Error",
      description: "You need to be logged in to send messages",
      variant: "destructive",
    });
    return null;
  }

  if (!text.trim()) {
    toast({
      title: "Error",
      description: "Message cannot be empty",
      variant: "destructive",
    });
    return null;
  }

  return {
    id: `msg-${Date.now()}`,
    orderId,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role as UserRole,
    text,
    createdAt: new Date(),
  };
};

// Send message to Supabase database
export const sendMessageToSupabase = async (
  orderId: string,
  senderId: string,
  senderName: string,
  senderRole: string,
  text: string
): Promise<boolean> => {
  try {
    console.log("Sending message to Supabase with data:", {
      order_id: orderId,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      text: text.trim()
    });
    
    // Added more detailed logging and error handling
    const { data, error } = await supabase
      .from('messages')
      .insert({
        order_id: orderId,
        sender_id: senderId,
        sender_name: senderName,
        sender_role: senderRole,
        text: text.trim()
      })
      .select();

    if (error) {
      console.error("Error sending message to Supabase:", error);
      toast({
        title: "Message not sent",
        description: `Error: ${error.message}. Please try again.`,
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Message successfully sent to Supabase:", data);
    return true;
  } catch (error) {
    console.error("Exception sending message:", error);
    toast({
      title: "Message not sent",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

// Load messages for a specific order from Supabase
export const loadMessagesFromSupabase = async (orderId?: string): Promise<Message[]> => {
  try {
    console.log(`Attempting to load messages ${orderId ? `for order ${orderId}` : 'for all orders'}`);
    
    let query = supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    // If orderId is provided, filter by it
    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Error loading messages from Supabase:", error);
      toast({
        title: "Error loading messages",
        description: `Could not load chat messages: ${error.message}`,
        variant: "destructive",
      });
      return [];
    }
    
    console.log(`Loaded ${data?.length || 0} messages from Supabase${orderId ? ` for order ${orderId}` : ''}`);
    
    // Convert from Supabase format to app format
    return (data || []).map(item => ({
      id: item.id,
      orderId: item.order_id,
      senderId: item.sender_id,
      senderName: item.sender_name,
      senderRole: item.sender_role as UserRole,
      text: item.text,
      createdAt: new Date(item.created_at),
    }));
  } catch (error) {
    console.error("Exception loading messages from Supabase:", error);
    toast({
      title: "Error loading messages",
      description: "An unexpected error occurred while loading messages.",
      variant: "destructive",
    });
    return [];
  }
};

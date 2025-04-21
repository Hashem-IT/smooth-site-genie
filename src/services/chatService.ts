
import { Message, UserRole } from "@/types";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { MOCK_MESSAGES } from "@/utils/chatUtils";

const STORAGE_KEY = "easydrop-messages";

export const loadMessages = (): Message[] => {
  return getFromStorage<Message[]>(STORAGE_KEY, MOCK_MESSAGES);
};

export const saveMessages = (messages: Message[]): void => {
  saveToStorage(STORAGE_KEY, messages);
};

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

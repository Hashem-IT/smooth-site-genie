
import { Message, UserRole } from "@/types";

export const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    orderId: "order-1",
    senderId: "business-1",
    senderName: "Sample Business",
    senderRole: "business",
    text: "Hello, is the delivery on track?",
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  },
  {
    id: "msg-2",
    orderId: "order-1",
    senderId: "driver-1",
    senderName: "Sample Driver",
    senderRole: "driver",
    text: "Yes, I'll be there in about 30 minutes.",
    createdAt: new Date(Date.now() - 3000000), // 50 minutes ago
  },
];

export const filterMessagesByUserAndOrder = (
  messages: Message[], 
  orderId: string, 
  userId: string | undefined,
  orderBusinessId: string | undefined,
  orderDriverId: string | undefined
): Message[] => {
  if (!userId) return [];
  
  // Only return messages for this specific order where the user is either the business owner or the driver
  return messages.filter((message) => {
    return message.orderId === orderId && 
           (message.senderId === userId || 
            message.senderId === orderBusinessId || 
            message.senderId === orderDriverId);
  });
};

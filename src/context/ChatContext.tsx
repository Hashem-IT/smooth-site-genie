
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, UserRole, Order } from "@/types";
import { useAuth } from "./AuthContext";
import { useOrders } from "./OrderContext";
import { filterMessagesByUserAndOrder } from "@/utils/chatUtils";
import { loadMessages, saveMessages, createNewMessage } from "@/services/chatService";

interface ChatContextType {
  messages: Message[];
  orderMessages: (orderId: string) => Message[];
  sendMessage: (orderId: string, text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { orders } = useOrders();

  useEffect(() => {
    // Load messages from localStorage
    setMessages(loadMessages());
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const orderMessages = (orderId: string) => {
    if (!user) return [];
    
    // Find the order to get business and driver IDs
    const order = orders.find(o => o.id === orderId);
    if (!order) return [];
    
    // Only allow messages between the business owner and the driver of this order
    return filterMessagesByUserAndOrder(
      messages, 
      orderId, 
      user.id, 
      order.businessId, 
      order.driverId
    );
  };

  const sendMessage = (orderId: string, text: string) => {
    const newMessage = createNewMessage(user, orderId, text);
    
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, orderMessages, sendMessage }}>
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

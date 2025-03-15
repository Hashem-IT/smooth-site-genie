
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface ChatContextType {
  messages: Message[];
  orderMessages: (orderId: string) => Message[];
  sendMessage: (orderId: string, text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MOCK_MESSAGES: Message[] = [
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

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const { user } = useAuth();

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem("delivery-connect-messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("delivery-connect-messages", JSON.stringify(messages));
  }, [messages]);

  const orderMessages = (orderId: string) => {
    return messages.filter((message) => message.orderId === orderId);
  };

  const sendMessage = (orderId: string, text: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      orderId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role as UserRole,
      text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
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

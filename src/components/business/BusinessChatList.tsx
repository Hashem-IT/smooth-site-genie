
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat, ChatMessage } from "@/context/ChatContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const BusinessChatList: React.FC<{ orderId?: string; companyId?: string }> = ({ orderId, companyId }) => {
  const { user } = useAuth();
  const { 
    chatMessages, 
    sendMessage,
    loadMessagesForOrder,
    loadMessagesForCompany,
    markMessagesRead,
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const conversationKey = orderId ?? companyId ?? "";

  // Load messages when orderId or companyId changes
  useEffect(() => {
    if (!user) return;
    
    if (orderId) {
      loadMessagesForOrder(orderId);
    } else if (companyId && user) {
      loadMessagesForCompany(user.id, companyId);
    }
  }, [orderId, companyId, user, loadMessagesForOrder, loadMessagesForCompany]);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (conversationKey && user) {
      markMessagesRead(conversationKey);
    }
  }, [conversationKey, markMessagesRead, chatMessages, user]);

  const messages: ChatMessage[] = chatMessages[conversationKey] || [];

  const handleSend = async () => {
    if (!inputMessage.trim() || !user) return;
    setLoading(true);
    
    try {
      // For company chat, we must set the recipientId to the company id
      // For order chat, we use null as recipient (legacy behavior)
      const recipientId = companyId || null;
      
      if (!recipientId && !orderId) {
        throw new Error("Either recipientId or orderId must be provided");
      }
      
      console.log("Sending message with:", {
        orderId,
        recipientId,
        messageText: inputMessage.trim(),
        userId: user.id
      });
      
      await sendMessage({
        orderId: orderId ?? null,
        recipientId,
        messageText: inputMessage.trim(),
      });
      
      setInputMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p>Please login to view the chat.</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-[400px] rounded-lg p-4 bg-background">
      <CardContent className="flex flex-col flex-1 overflow-auto space-y-2 mb-4 rounded max-h-[320px] p-0">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center mt-6">No messages yet.</p>
        ) : messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.senderId === user.id ? "bg-primary text-primary-foreground self-end" : "bg-muted text-muted-foreground self-start"
            }`}
          >
            <p>{msg.messageText}</p>
            <p className="text-xs mt-1 opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </CardContent>
      <div className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              await handleSend();
            }
          }}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </div>
    </Card>
  );
};

export default BusinessChatList;

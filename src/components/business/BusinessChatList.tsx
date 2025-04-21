
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat, ChatMessage } from "@/context/ChatContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BusinessChatList: React.FC<{ orderId?: string; companyId?: string }> = ({ orderId, companyId }) => {
  const { user } = useAuth();
  const { 
    chatMessages, 
    sendMessage,
    loadMessagesForOrder,
    loadMessagesForCompany,
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const conversationKey = orderId ?? companyId ?? "";

  // Load messages when orderId or companyId changes
  useEffect(() => {
    if (orderId) {
      loadMessagesForOrder(orderId);
    } else if (companyId) {
      loadMessagesForCompany(companyId);
    }
  }, [orderId, companyId, loadMessagesForOrder, loadMessagesForCompany]);

  const messages: ChatMessage[] = chatMessages[conversationKey] || [];

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    setLoading(true);
    try {
      await sendMessage({
        orderId: orderId ?? null,
        recipientId: null, // We don't have recipient logic here, default to null or add logic in future
        messageText: inputMessage.trim(),
      });
      setInputMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p>Please login to view the chat.</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col h-[400px] rounded-lg p-4 bg-background">
      <CardContent className="flex flex-col flex-1 overflow-auto space-y-2 mb-4 rounded max-h-[320px]">
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
            <p className="text-xs mt-1 text-muted-foreground text-right">
              {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

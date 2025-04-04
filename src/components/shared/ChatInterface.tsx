
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatInterfaceProps {
  orderId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ orderId }) => {
  const { orderMessages, sendMessage } = useChat();
  const { user } = useAuth();
  const { orders } = useOrders();
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const messages = orderMessages(orderId);
  const order = orders.find(o => o.id === orderId);
  
  // Updated logic to allow drivers to chat before booking
  const canChat = !!user && !!order && (
    (user.role === "business" && order.businessId === user.id) ||
    (user.role === "driver") // Allow all drivers to chat with any order
  );
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || !canChat) return;
    
    sendMessage(orderId, message);
    setMessage("");
  };
  
  if (!canChat) {
    return (
      <div className="flex flex-col h-[400px] max-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          You don't have permission to chat about this order.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[400px] max-h-[400px]">
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = user?.id === msg.senderId;
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      isMyMessage 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="text-xs mb-1">
                      {!isMyMessage && <span className="font-semibold">{msg.senderName} </span>}
                      <span className="text-xs opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2 border-t">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;


import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  orderId: string;
  partnerId?: string; // Optional specific partner ID for business users
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ orderId, partnerId }) => {
  const { orderMessages, sendMessage } = useChat();
  const { user } = useAuth();
  const { orders } = useOrders();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [lastRead, setLastRead] = useState(new Date());
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const messages = orderMessages(orderId);
  const order = orders.find(o => o.id === orderId);
  
  // Updated logic to allow drivers to chat before booking
  const canChat = !!user && !!order && (
    (user.role === "business" && order.businessId === user.id) ||
    (user.role === "driver") // Allow all drivers to chat with any order
  );

  // Get the current chat partner (for business it's the driver, for driver it's the business)
  const chatPartner = user?.role === "business" 
    ? (partnerId ? orders.find(o => o.driverId === partnerId)?.driverName : order?.driverName) || "Interessenten" 
    : order?.businessName || "Business";
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Update last read time when messages are displayed
    setLastRead(new Date());
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || !canChat || sending) return;
    
    try {
      setSending(true);
      await sendMessage(orderId, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
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
  
  // Filter messages to show conversations specific to the current user and partner
  const filteredMessages = messages.filter(msg => {
    if (user?.role === "business") {
      // If partnerId is provided, only show messages with that specific driver
      if (partnerId) {
        return msg.senderId === user.id || msg.senderId === partnerId;
      }
      // If order has assigned driver, only show those messages
      if (order?.driverId) {
        return msg.senderId === user.id || msg.senderId === order.driverId;
      }
      // For business with no specific driver selected, show all messages for this order
      return true;
    } else if (user?.role === "driver") {
      // If we're a driver, only show our conversation with the business
      return msg.senderId === user.id || msg.senderId === order?.businessId;
    }
    return true;
  });
  
  return (
    <div className="flex flex-col h-[400px] max-h-[400px]">
      <div className="pb-2 text-center border-b">
        <p className="text-sm font-medium">
          Chat with {chatPartner} about order "{order?.name}"
        </p>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            filteredMessages.map((msg) => {
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
          disabled={sending}
        />
        <Button type="submit" size="icon" disabled={!message.trim() || sending}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;


import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ChatInterfaceProps {
  orderId: string;
  partnerId?: string; // Optional specific partner ID for business users
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ orderId, partnerId }) => {
  const { orderMessages, sendMessage, loadMessages } = useChat();
  const { user } = useAuth();
  const { orders, markOrderDelivered } = useOrders();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [lastRead, setLastRead] = useState(new Date());
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const allMessages = orderMessages(orderId);
  const order = orders.find(o => o.id === orderId);
  
  // Load messages when the component mounts or orderId/partnerId changes
  useEffect(() => {
    if (orderId) {
      console.log(`ChatInterface: Loading messages for order ${orderId}, partnerId: ${partnerId || 'none'}`);
      loadMessages(orderId);
    }
    
    // Set up interval to refresh messages
    const refreshInterval = setInterval(() => {
      if (orderId) {
        console.log(`ChatInterface: Refreshing messages for order ${orderId}`);
        loadMessages(orderId);
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, [orderId, partnerId, loadMessages]);
  
  // Allow all drivers to chat with any order, regardless of booking status
  const canChat = !!user && !!order && (
    (user.role === "business" && order.businessId === user.id) ||
    (user.role === "driver")
  );

  // Get the current chat partner
  const chatPartner = user?.role === "business" 
    ? (partnerId ? orders.find(o => o.driverId === partnerId)?.driverName || "Driver" : order?.driverName) || "Interested Driver" 
    : order?.businessName || "Business";

  // Filter messages appropriately based on user role and partnerId
  const filteredMessages = allMessages.filter(msg => {
    if (user?.role === "business" && partnerId) {
      // Business user with specific driver selected - show only messages between them
      return msg.senderId === user.id || msg.senderId === partnerId;
    } 
    else if (user?.role === "driver") {
      // Driver - show all messages for this order
      return true;
    }
    // Fallback - show all messages for this order
    return true;
  });
  
  // Debug information
  useEffect(() => {
    console.log("ChatInterface filtered messages:", {
      orderId,
      partnerId,
      userRole: user?.role,
      allMessagesCount: allMessages.length,
      filteredMessagesCount: filteredMessages.length
    });
  }, [allMessages, filteredMessages, orderId, partnerId, user?.role]);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Update last read time when messages are displayed
    setLastRead(new Date());
  }, [filteredMessages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || !canChat || sending) return;
    
    try {
      setSending(true);
      console.log("Sending message:", {
        orderId,
        message,
        partnerId: partnerId || "none"
      });
      
      // Save the message text before clearing the input
      const messageText = message;
      
      // Clear the message input immediately for better UX
      setMessage("");
      
      // Send the message
      await sendMessage(orderId, messageText, partnerId);
      
      // Force reload messages after sending
      setTimeout(() => loadMessages(orderId), 500);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      // Restore the message text if sending fails
      setMessage(message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!order || !user) return;
    
    try {
      await markOrderDelivered(orderId);
      toast({
        title: "Order updated",
        description: "The order has been marked as delivered.",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Update failed",
        description: "Could not update the order status.",
        variant: "destructive"
      });
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
  
  return (
    <div className="flex flex-col h-[400px] max-h-[400px]">
      <div className="pb-2 text-center border-b flex justify-between items-center">
        <p className="text-sm font-medium">
          Chat with {chatPartner} about order "{order?.name}"
        </p>
        {user?.role === "driver" && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDeleteOrder}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Mark Delivered
          </Button>
        )}
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
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2 p-2 border-t">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[80px] resize-none"
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSendMessage(e);
            }
          }}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!message.trim() || sending}
        >
          {sending ? 
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : 
            <><Send className="h-4 w-4 mr-2" /> Send Message</>
          }
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;

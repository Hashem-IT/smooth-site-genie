
import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Trash2, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInterfaceProps {
  orderId: string;
  partnerId?: string; // Optional specific partner ID for business users
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ orderId, partnerId }) => {
  const { orderMessages, sendMessage, loadMessages, isRefreshing } = useChat();
  const { user } = useAuth();
  const { orders, markOrderDelivered } = useOrders();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [lastRead, setLastRead] = useState(new Date());
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const allMessages = orderMessages(orderId);
  const order = orders.find(o => o.id === orderId);
  
  // Load messages when the component mounts or orderId/partnerId changes
  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);
    setError("");
    
    if (orderId) {
      console.log(`ChatInterface: Loading messages for order ${orderId}, partnerId: ${partnerId || 'none'}`);
      loadMessages(orderId)
        .then(() => {
          if (isMounted) {
            setIsLoaded(true);
          }
        })
        .catch(err => {
          console.error("Failed to load messages:", err);
          if (isMounted) {
            setError("Failed to load messages. Please try refreshing.");
            setIsLoaded(true);
          }
        });
    }
    
    return () => {
      isMounted = false;
    };
  }, [orderId, partnerId, loadMessages]);
  
  // Can send messages if user is logged in and order exists
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
  
  const handleManualRefresh = () => {
    if (orderId) {
      setError("");
      loadMessages(orderId)
        .then(() => {
          toast({
            title: "Messages refreshed",
            description: "Latest messages have been loaded",
          });
        })
        .catch((error) => {
          console.error("Error refreshing:", error);
          setError("Failed to refresh messages");
          toast({
            title: "Refresh failed",
            description: "Could not refresh messages. Please try again.",
            variant: "destructive"
          });
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
        {!isLoaded && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="p-4 text-center">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
        
        {isLoaded && !error && (
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
        )}
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex flex-col gap-2 p-2 border-t">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[80px] resize-none"
          disabled={sending || isRefreshing || !isLoaded || !!error}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSendMessage(e);
            }
          }}
        />
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-1/4"
          >
            {isRefreshing ? 
              <Loader2 className="h-4 w-4 animate-spin" /> : 
              <RefreshCw className="h-4 w-4" />
            }
          </Button>
          <Button 
            type="submit" 
            className="w-3/4" 
            disabled={!message.trim() || sending || isRefreshing || !isLoaded || !!error}
          >
            {sending ? 
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : 
              <><Send className="h-4 w-4 mr-2" /> Send Message</>
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

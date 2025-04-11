
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useOrders } from "@/context/OrderContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, User, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessChatList = ({ orderId }: { orderId: string }) => {
  const { user } = useAuth();
  const { messages, orderMessages, loadMessages, isRefreshing } = useChat();
  const { orders } = useOrders();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastReadTimes, setLastReadTimes] = useState<Record<string, Date>>({});
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const order = orders.find(o => o.id === orderId);
  const orderSpecificMessages = orderMessages(orderId);
  
  // Load messages when the component mounts
  useEffect(() => {
    let isMounted = true;
    
    if (orderId) {
      setIsLoaded(false);
      setError("");
      console.log(`BusinessChatList: Loading messages for order ${orderId}`);
      
      loadMessages(orderId)
        .then(() => {
          if (isMounted) {
            setIsLoaded(true);
          }
        })
        .catch(error => {
          console.error("Error loading messages:", error);
          if (isMounted) {
            setError("Failed to load messages");
            setIsLoaded(true);
          }
        });
    }
    
    return () => {
      isMounted = false;
    };
  }, [orderId, loadMessages]);
  
  // Manual refresh function
  const handleRefresh = () => {
    if (orderId && !isRefreshing) {
      setError("");
      console.log(`BusinessChatList: Manually refreshing messages for order ${orderId}`);
      
      loadMessages(orderId)
        .then(() => {
          toast({
            title: "Messages refreshed",
            description: "Latest messages have been loaded",
          });
        })
        .catch((error) => {
          console.error("Error refreshing messages:", error);
          setError("Failed to refresh messages");
          toast({
            title: "Refresh failed",
            description: "Could not refresh messages. Please try again.",
            variant: "destructive",
          });
        });
    }
  };
  
  // Track when a chat was last opened for each driver
  useEffect(() => {
    if (selectedDriverId && isChatOpen) {
      setLastReadTimes(prev => ({
        ...prev,
        [selectedDriverId]: new Date()
      }));
    }
  }, [isChatOpen, selectedDriverId]);

  // Get unique driver IDs who have sent messages about this order
  const driverIds = Array.from(new Set(
    orderSpecificMessages
      .filter(msg => msg.senderRole === "driver")
      .map(msg => msg.senderId)
  ));
  
  console.log(`Found ${driverIds.length} unique drivers for order ${orderId}`);

  // Check if a driver has sent new messages since last read
  const hasNewMessages = (driverId: string): boolean => {
    const lastRead = lastReadTimes[driverId];
    if (!lastRead) return true;
    
    // Only show new message indicator for messages from this specific driver
    return orderSpecificMessages.some(msg => 
      msg.senderId === driverId && 
      msg.createdAt > lastRead
    );
  };

  const openChat = (driverId: string) => {
    console.log(`Opening chat with driver ${driverId}`);
    setSelectedDriverId(driverId);
    setIsChatOpen(true);
    setLastReadTimes(prev => ({
      ...prev,
      [driverId]: new Date()
    }));
  };

  // Get the name of a driver by their ID
  const getDriverName = (driverId: string): string => {
    const message = orderSpecificMessages.find(msg => msg.senderId === driverId);
    return message?.senderName || "Unknown Driver";
  };

  // Get the latest message from the conversation with a specific driver
  const getLatestMessage = (driverId: string) => {
    // Filter to get only messages between this specific driver and the business
    const driverMessages = orderSpecificMessages.filter(
      msg => msg.senderId === driverId || msg.senderId === user?.id
    );
    
    if (driverMessages.length === 0) return null;
    
    // Sort messages by date and get the latest one
    return driverMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  };

  if (!order || !user || user.role !== "business") {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No chat messages for this order yet.
      </div>
    );
  }

  if (!isLoaded && !error) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Trying again...' : 'Try Again'}
        </Button>
      </div>
    );
  }

  // If there are no driver messages, display a message
  if (driverIds.length === 0) {
    return (
      <div className="text-center p-4 space-y-4">
        <p className="text-muted-foreground">
          No drivers have sent messages for this order yet.
        </p>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Messages'}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Driver Messages</h3>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="space-y-2 mt-2">
        {driverIds.map(driverId => {
          const driverName = getDriverName(driverId);
          const latestMessage = getLatestMessage(driverId);
          const hasNewMsg = hasNewMessages(driverId);
          
          return (
            <Card 
              key={driverId} 
              className={`cursor-pointer hover:bg-accent/50 ${hasNewMsg ? 'border-primary' : ''}`}
              onClick={() => openChat(driverId)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted p-2 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-1">
                      {driverName}
                      {hasNewMsg && (
                        <span className="h-2 w-2 bg-red-500 rounded-full inline-block" />
                      )}
                    </h4>
                    {latestMessage && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {latestMessage.text}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {latestMessage && new Date(latestMessage.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedDriverId && (
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat - {order.name}</span>
              </DialogTitle>
              <DialogDescription>
                Chat with {getDriverName(selectedDriverId)} about this order
              </DialogDescription>
            </DialogHeader>
            <ChatInterface orderId={orderId} partnerId={selectedDriverId} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusinessChatList;

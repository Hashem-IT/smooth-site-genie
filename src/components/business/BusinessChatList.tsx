
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useOrders } from "@/context/OrderContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";

const BusinessChatList = ({ orderId }: { orderId: string }) => {
  const { user } = useAuth();
  const { messages, orderMessages } = useChat();
  const { orders } = useOrders();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lastReadTimes, setLastReadTimes] = useState<Record<string, Date>>({});

  const order = orders.find(o => o.id === orderId);
  const orderSpecificMessages = orderMessages(orderId);

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

  // Check if a driver has sent new messages
  const hasNewMessages = (driverId: string): boolean => {
    const lastRead = lastReadTimes[driverId];
    if (!lastRead) return true;
    
    return orderSpecificMessages.some(msg => 
      msg.senderId === driverId && 
      msg.createdAt > lastRead
    );
  };

  const openChat = (driverId: string) => {
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

  // Get the latest message from a specific driver
  const getLatestMessage = (driverId: string) => {
    const driverMessages = orderSpecificMessages.filter(
      msg => msg.senderId === driverId || msg.senderId === user?.id
    );
    
    if (driverMessages.length === 0) return null;
    
    // Sort messages by date and get the latest one
    return driverMessages.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  };

  if (!order || !user || user.role !== "business" || driverIds.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No chat messages for this order yet.
      </div>
    );
  }

  return (
    <div>
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

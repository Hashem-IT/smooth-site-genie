
import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, MapPin, MessageSquare, Filter, Circle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChat } from "@/context/ChatContext";

const DriverOrderList: React.FC = () => {
  const { user } = useAuth();
  const { availableOrders, userOrders, updateOrderLocation } = useOrders();
  const { orderMessages } = useChat();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastReadTimes, setLastReadTimes] = useState<Record<string, Date>>({});

  // Track when a chat was last opened for each order
  useEffect(() => {
    if (selectedOrder && isChatOpen) {
      setLastReadTimes(prev => ({
        ...prev,
        [selectedOrder.id]: new Date()
      }));
    }
  }, [isChatOpen, selectedOrder]);

  React.useEffect(() => {
    if (!user) return;
    const confirmedOrders = userOrders.filter(order => order.status === "confirmed");
    if (confirmedOrders.length === 0) return;
    const interval = setInterval(() => {
      confirmedOrders.forEach(order => {
        const lat = 48.0 + Math.random() * 2;
        const lng = 16.0 + Math.random() * 2;
        updateOrderLocation(order.id, lat, lng);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [userOrders, user, updateOrderLocation]);

  // Check for new messages in an order
  const hasNewMessages = (order: Order): boolean => {
    const lastRead = lastReadTimes[order.id];
    if (!lastRead) return orderMessages(order.id).length > 0;
    
    return orderMessages(order.id).some(msg => 
      msg.createdAt > lastRead && 
      msg.senderId !== user?.id
    );
  };

  const openChat = (order: Order) => {
    setSelectedOrder(order);
    setIsChatOpen(true);
    // Mark as read when opening chat
    setLastReadTimes(prev => ({
      ...prev,
      [order.id]: new Date()
    }));
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    booked: "bg-blue-500",
    confirmed: "bg-green-500",
    delivered: "bg-purple-500"
  };

  const filteredAvailableOrders = statusFilter === "all" ? availableOrders : availableOrders.filter(order => order.status === statusFilter);
  const filteredUserOrders = statusFilter === "all" ? userOrders : userOrders.filter(order => order.status === statusFilter);

  const renderOrderCard = (order: Order, isMyOrder: boolean = false) => (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.name}</CardTitle>
            <CardDescription className="text-sm">{order.description}</CardDescription>
          </div>
          <Badge className={statusColors[order.status]}>
            {order.status === "pending" && "Open"}
            {order.status === "booked" && "Ordered"}
            {order.status === "confirmed" && "Confirmed"}
            {order.status === "delivered" && "Delivered"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Price:</span>{" "}
            <span className="font-medium">€{order.price.toFixed(2)}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Weight:</span>{" "}
            <span className="font-medium">{order.weight} kg</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Size:</span>{" "}
            <span className="font-medium">{order.size}</span>
          </div>
        </div>
        
        {order.imageUrl && <img src={order.imageUrl} alt={order.name} className="h-20 w-full rounded-md mt-2 object-contain" />}
        
        <div className="mt-3 space-y-2">
          {order.fromAddress && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">From: </span>
                <span>{order.fromAddress}</span>
              </div>
            </div>
          )}
          
          {order.toAddress && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">To: </span>
                <span>{order.toAddress}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-2 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">Business: {order.businessName}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 relative" 
          onClick={() => openChat(order)}
        >
          <MessageSquare className="h-4 w-4" />
          Chat with Business
          {hasNewMessages(order) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by status:</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Open</SelectItem>
            <SelectItem value="booked">Ordered</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="available" className="relative">
            Available Orders
            {filteredAvailableOrders.some(order => hasNewMessages(order)) && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="my-orders" className="relative">
            My Orders
            {filteredUserOrders.some(order => hasNewMessages(order)) && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          {filteredAvailableOrders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No available orders</h3>
              <p className="mt-2 text-gray-500">Check back later for new delivery opportunities.</p>
            </div>
          ) : (
            filteredAvailableOrders.map(order => renderOrderCard(order))
          )}
        </TabsContent>
        
        <TabsContent value="my-orders" className="space-y-4">
          {filteredUserOrders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
              <p className="mt-2 text-gray-500">You will see orders assigned to you here.</p>
            </div>
          ) : (
            filteredUserOrders.map(order => renderOrderCard(order, true))
          )}
        </TabsContent>
      </Tabs>
      
      {selectedOrder && (
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat - {selectedOrder.name}</span>
              </DialogTitle>
              <DialogDescription>
                Chat with {selectedOrder.businessName} about this order
              </DialogDescription>
            </DialogHeader>
            <ChatInterface orderId={selectedOrder.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DriverOrderList;


import React, { useState } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MapPin, MessageSquare, Truck, Filter } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DriverOrderList: React.FC = () => {
  const { user } = useAuth();
  const { availableOrders, userOrders, bookOrder, updateOrderLocation, markOrderDelivered } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Simulate location updates for active orders
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
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [userOrders, user, updateOrderLocation]);
  
  const handleBookOrder = (orderId: string) => {
    bookOrder(orderId);
  };
  
  const handleMarkDelivered = (orderId: string) => {
    markOrderDelivered(orderId);
  };
  
  const openChat = (order: Order) => {
    setSelectedOrder(order);
    setIsChatOpen(true);
  };
  
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    booked: "bg-blue-500",
    confirmed: "bg-green-500",
    delivered: "bg-purple-500",
  };

  // Filter orders based on status
  const filteredAvailableOrders = statusFilter === "all" 
    ? availableOrders 
    : availableOrders.filter(order => order.status === statusFilter);

  const filteredUserOrders = statusFilter === "all"
    ? userOrders
    : userOrders.filter(order => order.status === statusFilter);
  
  const renderOrderCard = (order: Order, isMyOrder: boolean = false) => (
    <Card key={order.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.name}</CardTitle>
            <CardDescription className="text-sm">{order.description}</CardDescription>
          </div>
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
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
        
        {order.imageUrl && (
          <img 
            src={order.imageUrl} 
            alt={order.name}
            className="object-cover h-24 w-full rounded-md mt-2"
          />
        )}
        
        <div className="mt-2 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">Business: {order.businessName}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {!isMyOrder && (
          <Button 
            onClick={() => handleBookOrder(order.id)}
            size="sm"
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Book This Order
          </Button>
        )}
        
        {isMyOrder && order.status === "confirmed" && (
          <Button 
            onClick={() => handleMarkDelivered(order.id)}
            size="sm"
            className="flex items-center gap-1"
          >
            <Truck className="h-4 w-4" />
            Mark Delivered
          </Button>
        )}
        
        {isMyOrder && (
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => openChat(order)}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
        )}
        
        <div className="ml-auto flex items-center text-muted-foreground text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
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
            <SelectItem value="pending">Available</SelectItem>
            <SelectItem value="booked">Booked</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="available">Available Orders</TabsTrigger>
          <TabsTrigger value="my-orders">My Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          {filteredAvailableOrders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No available orders</h3>
              <p className="mt-2 text-gray-500">Check back later for new delivery opportunities.</p>
            </div>
          ) : (
            filteredAvailableOrders.map((order) => renderOrderCard(order))
          )}
        </TabsContent>
        
        <TabsContent value="my-orders" className="space-y-4">
          {filteredUserOrders.length === 0 ? (
            <div className="text-center p-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
              <p className="mt-2 text-gray-500">Book your first order to get started.</p>
            </div>
          ) : (
            filteredUserOrders.map((order) => renderOrderCard(order, true))
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
            </DialogHeader>
            <ChatInterface orderId={selectedOrder.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DriverOrderList;

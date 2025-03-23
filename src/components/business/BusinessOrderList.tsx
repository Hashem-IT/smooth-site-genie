
import React, { useState } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MapPin, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import OrderMap from "../shared/OrderMap";

const BusinessOrderList: React.FC = () => {
  const { userOrders, confirmOrder } = useOrders();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Only show orders that belong to the current business user
  const businessOrders = userOrders.filter(order => order.businessId === user?.id);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    booked: "bg-blue-500",
    confirmed: "bg-green-500",
    delivered: "bg-purple-500",
  };

  const handleConfirmOrder = (orderId: string) => {
    confirmOrder(orderId);
  };

  const openChat = (order: Order) => {
    setSelectedOrder(order);
    setIsChatOpen(true);
  };

  const openMap = (order: Order) => {
    setSelectedOrder(order);
    setIsMapOpen(true);
  };

  if (businessOrders.length === 0) {
    return (
      <div className="text-center p-8">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
        <p className="mt-2 text-gray-500">Create your first order to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {businessOrders.map((order) => (
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
                className="object-cover h-20 w-full rounded-md mt-2" // Reduced from h-24 to h-20
              />
            )}
            
            {order.driverName && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <span className="text-sm font-medium">Driver: {order.driverName}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {order.status === "booked" && (
              <Button 
                onClick={() => handleConfirmOrder(order.id)}
                size="sm"
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm
              </Button>
            )}
            
            {order.status !== "pending" && (
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
            
            {order.status === "confirmed" && order.location && (
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => openMap(order)}
              >
                <MapPin className="h-4 w-4" />
                Track
              </Button>
            )}
            
            <div className="ml-auto flex items-center text-muted-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </CardFooter>
        </Card>
      ))}
      
      {selectedOrder && (
        <>
          <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Chat - {selectedOrder.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Chat with {selectedOrder.driverName || "the driver"} about this order
                </DialogDescription>
              </DialogHeader>
              <ChatInterface orderId={selectedOrder.id} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Track Order - {selectedOrder.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Track the location of your order in real-time
                </DialogDescription>
              </DialogHeader>
              <div className="h-[400px]">
                <OrderMap order={selectedOrder} />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default BusinessOrderList;

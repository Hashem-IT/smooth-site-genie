
import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MapPin, MessageSquare, LocateIcon, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import OrderMap from "../shared/OrderMap";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";

const BusinessOrderList: React.FC = () => {
  const {
    userOrders,
    confirmOrder,
    loadOrders
  } = useOrders();
  const {
    user
  } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Nur Bestellungen anzeigen, die dem aktuellen Business-Benutzer gehören
  const businessOrders = userOrders.filter(order => order.businessId === user?.id);
  
  // Sortieren, damit gebuchte Bestellungen, die Bestätigung benötigen, zuerst erscheinen
  const sortedBusinessOrders = [...businessOrders].sort((a, b) => {
    if (a.status === "booked" && b.status !== "booked") return -1;
    if (a.status !== "booked" && b.status === "booked") return 1;
    return new Date(b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)).getTime() - 
           new Date(a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)).getTime();
  });
  
  // Benachrichtigungen laden
  useEffect(() => {
    if (user && user.role === "business") {
      const businessNotifications = getFromStorage<Record<string, any[]>>("business-notifications", {});
      setNotifications(businessNotifications[user.id] || []);
      
      // Set up interval to check for new notifications
      const interval = setInterval(() => {
        const freshNotifications = getFromStorage<Record<string, any[]>>("business-notifications", {});
        if (freshNotifications[user.id]?.length !== notifications.length) {
          setNotifications(freshNotifications[user.id] || []);
          // Show toast for new notifications
          if ((freshNotifications[user.id] || []).length > notifications.length) {
            toast({
              title: "New notification",
              description: "You have new order bookings that need confirmation",
            });
          }
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [user, notifications.length]);

  // Refresh the orders periodically to check for new bookings
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [loadOrders]);
  
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    booked: "bg-blue-500",
    confirmed: "bg-green-500",
    delivered: "bg-purple-500"
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
  
  // Anzahl der Bestellungen, die Bestätigung benötigen
  const pendingConfirmations = businessOrders.filter(order => order.status === "booked").length;
  
  if (businessOrders.length === 0) {
    return <div className="text-center p-8">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
        <p className="mt-2 text-gray-500">Create your first order to get started.</p>
      </div>;
  }
  
  return <div className="space-y-4">
      {pendingConfirmations > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center mb-4">
          <Bell className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <p className="font-medium text-amber-800">
              You have {pendingConfirmations} {pendingConfirmations === 1 ? 'order' : 'orders'} that need your confirmation!
            </p>
            <p className="text-sm text-amber-600">
              Drivers are waiting for your approval to proceed with delivery.
            </p>
          </div>
        </div>
      )}
      
      {sortedBusinessOrders.map(order => (
        <Card key={order.id} className={`overflow-hidden ${order.status === "booked" ? "border-blue-400 shadow-md" : ""}`}>
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
            
            {order.imageUrl && <img src={order.imageUrl} alt={order.name} className="h-20 w-full rounded-md mt-2 object-contain" />}
            
            {/* Address Information */}
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
            
            {order.driverName && (
              <div className={`mt-2 p-2 ${order.status === "booked" ? "bg-blue-50 border border-blue-200" : "bg-muted"} rounded-md`}>
                <span className="text-sm font-medium">Driver: {order.driverName}</span>
                
                {order.status === "booked" && (
                  <p className="text-xs text-blue-600 mt-1">
                    This driver is waiting for your confirmation.
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {order.status === "booked" && (
              <Button 
                onClick={() => handleConfirmOrder(order.id)} 
                size="sm" 
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm Order
              </Button>
            )}
            
            {order.status !== "pending" && order.driverId && (
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openChat(order)}>
                <MessageSquare className="h-4 w-4" />
                Chat with Driver
              </Button>
            )}
            
            {order.status === "confirmed" && order.location && (
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openMap(order)}>
                <MapPin className="h-4 w-4" />
                Track
              </Button>
            )}
            
            <div className="ml-auto flex items-center text-muted-foreground text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(order.createdAt instanceof Date ? order.createdAt : new Date(order.createdAt)).toLocaleDateString()}
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
    </div>;
};

export default BusinessOrderList;

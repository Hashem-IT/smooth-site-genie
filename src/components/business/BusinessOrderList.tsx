import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MapPin, MessageSquare, Bell, RefreshCcw, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import OrderMap from "../shared/OrderMap";
import { getFromStorage } from "@/utils/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

const BusinessOrderList: React.FC = () => {
  const {
    orders,
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
  const [activeTab, setActiveTab] = useState("all");
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  useEffect(() => {
    console.log("BusinessOrderList mounted, loading orders");
    loadOrders();
    
    const refreshInterval = setInterval(() => {
      console.log("Refreshing orders (interval)");
      loadOrders();
    }, 10000);
    
    return () => clearInterval(refreshInterval);
  }, [loadOrders]);
  
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    console.log("Manual refresh requested");
    try {
      await loadOrders();
      toast({
        title: "Aktualisiert",
        description: "Bestellungen wurden aktualisiert",
      });
    } catch (error) {
      console.error("Manual refresh error:", error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const businessOrders = user ? orders.filter(order => order.businessId === user.id) : [];
  
  useEffect(() => {
    if (businessOrders.length > 0) {
      console.log("Business orders:", businessOrders.map(o => ({
        id: o.id, 
        name: o.name,
        status: o.status, 
        driverId: o.driverId
      })));
      
      const bookedOrders = businessOrders.filter(o => o.status === "booked");
      if (bookedOrders.length > 0) {
        console.log("Orders needing confirmation:", bookedOrders.map(o => ({
          id: o.id,
          name: o.name,
          driverName: o.driverName
        })));
      }
    } else {
      console.log("No business orders available");
    }
  }, [businessOrders]);
  
  const getFilteredOrders = (status: string) => {
    if (status === "all") return businessOrders;
    return businessOrders.filter(order => order.status === status);
  };
  
  const sortedBusinessOrders = [...getFilteredOrders(activeTab)].sort((a, b) => {
    if (a.status === "booked" && b.status !== "booked") return -1;
    if (a.status !== "booked" && b.status === "booked") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  useEffect(() => {
    if (user && user.role === "business") {
      const businessNotifications = getFromStorage<Record<string, any[]>>("business-notifications", {});
      setNotifications(businessNotifications[user.id] || []);
    }
  }, [user]);
  
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    booked: "bg-blue-500",
    confirmed: "bg-green-500",
    delivered: "bg-purple-500"
  };
  
  const handleSetOrderStatus = async (orderId: string, status: "pending" | "booked" | "delivered") => {
    if (!user || !orderId) return;

    try {
      setIsConfirming(orderId);
      
      const { error } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', orderId)
        .eq('business_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${status}.`
      });
      
      await loadOrders();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update order status.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(null);
    }
  };
  
  const openChat = (order: Order) => {
    setSelectedOrder(order);
    setIsChatOpen(true);
  };
  
  const openMap = (order: Order) => {
    setSelectedOrder(order);
    setIsMapOpen(true);
  };
  
  const handleDeleteOrder = async () => {
    if (!orderToDelete || !user) return;
    
    try {
      setIsDeleting(orderToDelete.id);
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderToDelete.id)
        .eq('business_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Order deleted",
        description: "The order has been successfully deleted."
      });
      
      setOrderToDelete(null);
      await loadOrders();
    } catch (error: any) {
      console.error("Error deleting order:", error);
      toast({
        title: "Deletion failed",
        description: error.message || "Could not delete the order.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  const pendingConfirmations = businessOrders.filter(order => order.status === "booked").length;
  
  if (businessOrders.length === 0 && isRefreshing) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (businessOrders.length === 0) {
    return (
      <div className="text-center p-8">
        <Package className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium">Keine Bestellungen vorhanden</h3>
        <p className="mt-2 text-gray-500">Erstellen Sie Ihre erste Bestellung, um zu beginnen.</p>
        
        <Button 
          onClick={handleManualRefresh} 
          variant="outline" 
          className="mt-4 flex items-center gap-2 mx-auto"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Aktualisiere...' : 'Aktualisieren'}</span>
        </Button>
      </div>
    );
  }
  
  const renderOrderCard = (order: Order) => (
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
            <span className="font-medium">€{order.price?.toFixed(2)}</span>
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
                <span className="font-medium">Von: </span>
                <span>{order.fromAddress}</span>
              </div>
            </div>
          )}
          
          {order.toAddress && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="font-medium">Nach: </span>
                <span>{order.toAddress}</span>
              </div>
            </div>
          )}
        </div>
        
        {(order.driverName || order.status === "pending") && (
          <div className={`mt-2 p-2 ${order.status === "booked" ? "bg-blue-50 border border-blue-200" : "bg-muted"} rounded-md`}>
            {order.driverName ? (
              <>
                <span className="text-sm font-medium">Fahrer: {order.driverName}</span>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 w-full justify-center"
                onClick={() => {
                  if (order.id) {
                    openChat(order);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Chat mit Interessenten
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {/* Status buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => handleSetOrderStatus(order.id, "pending")} 
            size="sm"
            variant={order.status === "pending" ? "default" : "outline"}
            className="flex items-center gap-1"
            disabled={isConfirming === order.id}
          >
            Open
          </Button>
          
          <Button 
            onClick={() => handleSetOrderStatus(order.id, "booked")} 
            size="sm"
            variant={order.status === "booked" ? "default" : "outline"}
            className="flex items-center gap-1"
            disabled={isConfirming === order.id}
          >
            Ordered
          </Button>
          
          <Button 
            onClick={() => handleSetOrderStatus(order.id, "delivered")} 
            size="sm"
            variant={order.status === "delivered" ? "default" : "outline"}
            className="flex items-center gap-1"
            disabled={isConfirming === order.id}
          >
            Delivered
          </Button>
        </div>
        
        {order.driverName && (
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openChat(order)}>
            <MessageSquare className="h-4 w-4" />
            Chat mit {order.driverName}
          </Button>
        )}
        
        {order.status === "confirmed" && order.location && (
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => openMap(order)}>
            <MapPin className="h-4 w-4" />
            Verfolgen
          </Button>
        )}
        
        <Button 
          variant="destructive" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => {
            setOrderToDelete(order);
          }}
          disabled={isDeleting === order.id}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        
        <div className="ml-auto flex items-center text-muted-foreground text-xs">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(order.createdAt).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button
          onClick={handleManualRefresh}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isRefreshing}
        >
          <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Aktualisiere...' : 'Aktualisieren'}</span>
        </Button>
      </div>
      
      {pendingConfirmations > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-center mb-4">
          <Bell className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <p className="font-medium text-amber-800">
              Sie haben {pendingConfirmations} {pendingConfirmations === 1 ? 'Bestellung' : 'Bestellungen'} im Status "Ordered"!
            </p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-center">
            Alle
            {businessOrders.length > 0 && <span className="ml-1 text-xs bg-gray-200 text-gray-700 rounded-full px-2">{businessOrders.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-center">
            Open
            {businessOrders.filter(o => o.status === "pending").length > 0 && 
              <span className="ml-1 text-xs bg-yellow-200 text-yellow-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "pending").length}
              </span>
            }
          </TabsTrigger>
          <TabsTrigger value="booked" className="text-center">
            Ordered
            {businessOrders.filter(o => o.status === "booked").length > 0 && 
              <span className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "booked").length}
              </span>
            }
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-center">
            Delivered
            {businessOrders.filter(o => o.status === "delivered").length > 0 && 
              <span className="ml-1 text-xs bg-purple-200 text-purple-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "delivered").length}
              </span>
            }
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {sortedBusinessOrders.map(order => (
        renderOrderCard(order)
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
                  Chat mit {selectedOrder.driverName || "Interessenten"} über diese Bestellung
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
                  <span>Bestellung verfolgen - {selectedOrder.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Verfolgen Sie die Position Ihrer Bestellung in Echtzeit
                </DialogDescription>
              </DialogHeader>
              <div className="h-[400px]">
                <OrderMap order={selectedOrder} />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
      
      {orderToDelete && (
        <Dialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting === orderToDelete.id}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteOrder}
                disabled={isDeleting === orderToDelete.id}
              >
                {isDeleting === orderToDelete.id ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusinessOrderList;


import React, { useState, useEffect } from "react";
import { Order } from "@/types";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, MapPin, MessageSquare, LocateIcon, Bell, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ChatInterface from "../shared/ChatInterface";
import OrderMap from "../shared/OrderMap";
import { getFromStorage } from "@/utils/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

  // Force orders refresh when component mounts and periodically
  useEffect(() => {
    console.log("BusinessOrderList mounted, loading orders");
    loadOrders();
    
    // Add a timer to refresh orders periodically
    const refreshInterval = setInterval(() => {
      console.log("Refreshing orders (interval)");
      loadOrders(true); // silent refresh
    }, 15000); // Refresh every 15 seconds
    
    return () => clearInterval(refreshInterval);
  }, [loadOrders]);
  
  // Manual refresh function with loading state
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
  
  // Filter orders to show only those belonging to this business
  const businessOrders = user ? orders.filter(order => order.businessId === user.id) : [];
  
  // Debug to check what orders we have and their status
  useEffect(() => {
    if (businessOrders.length > 0) {
      console.log("Business orders:", businessOrders.map(o => ({
        id: o.id, 
        name: o.name,
        status: o.status, 
        driverId: o.driverId
      })));
      
      // Specifically log any booked orders that need confirmation
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
  
  // Filter orders by status
  const getFilteredOrders = (status: string) => {
    if (status === "all") return businessOrders;
    return businessOrders.filter(order => order.status === status);
  };
  
  // Sort orders to prioritize those needing confirmation
  const sortedBusinessOrders = [...getFilteredOrders(activeTab)].sort((a, b) => {
    if (a.status === "booked" && b.status !== "booked") return -1;
    if (a.status !== "booked" && b.status === "booked") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Load notifications
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
  
  const handleConfirmOrder = async (orderId: string) => {
    console.log("Confirming order:", orderId);
    setIsConfirming(orderId);
    
    try {
      await confirmOrder(orderId);
      toast({
        title: "Bestellung bestätigt",
        description: "Der Fahrer wurde benachrichtigt und wird mit der Lieferung fortfahren."
      });
      
      // Force a refresh to immediately show updated UI
      await loadOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
      toast({
        title: "Bestätigung fehlgeschlagen",
        description: "Es gab ein Problem bei der Bestätigung der Bestellung. Bitte versuchen Sie es erneut.",
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
  
  // Count of orders needing confirmation
  const pendingConfirmations = businessOrders.filter(order => order.status === "booked").length;
  
  // If no orders but we're still loading, show skeletons
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
              Sie haben {pendingConfirmations} {pendingConfirmations === 1 ? 'Bestellung' : 'Bestellungen'}, die Ihre Bestätigung benötigen!
            </p>
            <p className="text-sm text-amber-600">
              Fahrer warten auf Ihre Freigabe, um mit der Lieferung fortzufahren.
            </p>
          </div>
        </div>
      )}
      
      {/* Add tabs for filtering */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" className="text-center">
            Alle
            {businessOrders.length > 0 && <span className="ml-1 text-xs bg-gray-200 text-gray-700 rounded-full px-2">{businessOrders.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-center">
            Offen
            {businessOrders.filter(o => o.status === "pending").length > 0 && 
              <span className="ml-1 text-xs bg-yellow-200 text-yellow-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "pending").length}
              </span>
            }
          </TabsTrigger>
          <TabsTrigger value="booked" className="text-center">
            Gebucht
            {businessOrders.filter(o => o.status === "booked").length > 0 && 
              <span className="ml-1 text-xs bg-blue-200 text-blue-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "booked").length}
              </span>
            }
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="text-center">
            Bestätigt
            {businessOrders.filter(o => o.status === "confirmed").length > 0 && 
              <span className="ml-1 text-xs bg-green-200 text-green-700 rounded-full px-2">
                {businessOrders.filter(o => o.status === "confirmed").length}
              </span>
            }
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {sortedBusinessOrders.map(order => (
        <Card key={order.id} className={`overflow-hidden ${order.status === "booked" ? "border-blue-400 shadow-md" : ""}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.name}</CardTitle>
                <CardDescription className="text-sm">{order.description}</CardDescription>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status === "pending" && "Offen"}
                {order.status === "booked" && "Gebucht"}
                {order.status === "confirmed" && "Bestätigt"}
                {order.status === "delivered" && "Geliefert"}
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
            
            {/* Address Information */}
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
            
            {order.driverName && (
              <div className={`mt-2 p-2 ${order.status === "booked" ? "bg-blue-50 border border-blue-200" : "bg-muted"} rounded-md`}>
                <span className="text-sm font-medium">Fahrer: {order.driverName}</span>
                
                {order.status === "booked" && (
                  <p className="text-xs text-blue-600 mt-1">
                    Dieser Fahrer wartet auf Ihre Bestätigung.
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
                disabled={isConfirming === order.id}
              >
                {isConfirming === order.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bestätige...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Bestätigen
                  </>
                )}
              </Button>
            )}
            
            {order.status !== "pending" && order.driverName && (
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
                  Chat mit {selectedOrder.driverName || "dem Fahrer"} über diese Bestellung
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
    </div>
  );
};

export default BusinessOrderList;

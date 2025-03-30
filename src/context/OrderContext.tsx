
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  availableOrders: Order[];
  filteredOrders: (status: string) => Order[];
  createOrder: (orderData: Partial<Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">>) => Promise<void>;
  bookOrder: (orderId: string) => Promise<void>;
  confirmOrder: (orderId: string) => Promise<void>;
  updateOrderLocation: (orderId: string, lat: number, lng: number) => Promise<void>;
  markOrderDelivered: (orderId: string) => Promise<void>;
  loadOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Laden von Bestellungen aus Supabase
  const loadOrders = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('orders')
        .select('*');
      
      // Fahrer sehen alle Bestellungen
      // Unternehmen sehen nur ihre eigenen Bestellungen
      if (user.role === 'business') {
        query = query.eq('business_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Konvertieren der Datenbankdaten in das Order-Format der Anwendung
        const formattedOrders: Order[] = data.map(item => ({
          id: item.id,
          businessId: item.business_id,
          businessName: item.business_name,
          name: item.name,
          description: item.description,
          price: item.price,
          weight: item.weight,
          size: item.size,
          imageUrl: item.image_url,
          status: item.status,
          driverId: item.driver_id,
          driverName: item.driver_name,
          createdAt: new Date(item.created_at),
          fromAddress: item.from_address,
          toAddress: item.to_address,
          location: item.location_lat && item.location_lng 
            ? { lat: item.location_lat, lng: item.location_lng } 
            : undefined,
        }));
        
        setOrders(formattedOrders);
      }
    } catch (error: any) {
      console.error("Fehler beim Laden der Bestellungen:", error.message);
      toast({
        title: "Fehler",
        description: "Bestellungen konnten nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  // Initial und bei Benutzeränderungen laden
  useEffect(() => {
    if (user) {
      loadOrders();
      
      // Echtzeit-Abonnement für Bestellungsänderungen
      const ordersSubscription = supabase
        .channel('orders_channel')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, (payload) => {
          // Bestellungen neu laden bei Änderungen
          loadOrders();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(ordersSubscription);
      };
    } else {
      setOrders([]);
    }
  }, [user]);

  // Bestellungen für den aktuellen Benutzer filtern
  const userOrders = user
    ? orders.filter(order => 
        (user.role === 'business' && order.businessId === user.id) || 
        (user.role === 'driver' && order.driverId === user.id))
    : [];

  // Verfügbare Bestellungen für Fahrer
  const availableOrders = user?.role === 'driver'
    ? orders.filter(order => order.status === 'pending')
    : [];

  // Bestellungen nach Status filtern
  const filteredOrders = (status: string) => {
    return status === 'all'
      ? orders
      : orders.filter(order => order.status === status);
  };

  // Neue Bestellung erstellen
  const createOrder = async (orderData: Partial<Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">>) => {
    if (!user || user.role !== 'business') {
      toast({
        title: "Fehler",
        description: "Nur Unternehmen können Bestellungen erstellen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: imageData, error: uploadError } = await uploadImage(orderData.imageUrl);
      
      if (uploadError && orderData.imageUrl && orderData.imageUrl !== "/placeholder.svg") {
        throw uploadError;
      }
      
      const newOrder = {
        business_id: user.id,
        business_name: user.name,
        name: orderData.name,
        description: orderData.description,
        price: orderData.price,
        weight: orderData.weight,
        size: orderData.size,
        image_url: imageData || orderData.imageUrl || "/placeholder.svg",
        status: 'pending' as OrderStatus,
        from_address: orderData.fromAddress,
        to_address: orderData.toAddress,
        created_at: new Date().toISOString(),
        driver_id: null,
      };
      
      const { error } = await supabase
        .from('orders')
        .insert(newOrder);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bestellung erstellt",
        description: "Ihre Bestellung wurde erfolgreich erstellt.",
      });
      
      await loadOrders();
    } catch (error: any) {
      console.error("Fehler beim Erstellen der Bestellung:", error);
      toast({
        title: "Fehler",
        description: error.message || "Die Bestellung konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  // Hilfsfunktion zum Hochladen von Bildern
  const uploadImage = async (imageUrl?: string): Promise<{ data: string | null, error: Error | null }> => {
    if (!imageUrl || imageUrl === "/placeholder.svg" || !imageUrl.startsWith('data:')) {
      return { data: imageUrl || null, error: null };
    }
    
    try {
      // Base64-Bild in Datei konvertieren
      const base64Data = imageUrl.split(',')[1];
      const blobData = atob(base64Data);
      const arrayBuffer = new ArrayBuffer(blobData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < blobData.length; i++) {
        uint8Array[i] = blobData.charCodeAt(i);
      }
      
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const file = new File([blob], `order-image-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Datei in Supabase Storage hochladen
      const { data, error } = await supabase
        .storage
        .from('order-images')
        .upload(`public/${file.name}`, file);
        
      if (error) {
        throw error;
      }
      
      // URL des hochgeladenen Bildes abrufen
      const { data: { publicUrl } } = supabase
        .storage
        .from('order-images')
        .getPublicUrl(`public/${file.name}`);
        
      return { data: publicUrl, error: null };
    } catch (error: any) {
      console.error("Fehler beim Hochladen des Bildes:", error);
      return { data: null, error };
    }
  };

  // Bestellung buchen (für Fahrer)
  const bookOrder = async (orderId: string) => {
    if (!user || user.role !== 'driver') {
      toast({
        title: "Fehler",
        description: "Nur Fahrer können Bestellungen buchen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'booked',
          driver_id: user.id,
          driver_name: user.name,
        })
        .eq('id', orderId)
        .eq('status', 'pending');
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bestellung gebucht",
        description: "Sie haben diese Bestellung erfolgreich gebucht. Warten Sie auf die Bestätigung.",
      });
      
      await loadOrders();
    } catch (error: any) {
      console.error("Fehler beim Buchen der Bestellung:", error);
      toast({
        title: "Fehler",
        description: error.message || "Die Bestellung konnte nicht gebucht werden.",
        variant: "destructive",
      });
    }
  };

  // Bestellung bestätigen (für Unternehmen)
  const confirmOrder = async (orderId: string) => {
    if (!user || user.role !== 'business') {
      toast({
        title: "Fehler",
        description: "Nur Unternehmen können Bestellungen bestätigen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
        })
        .eq('id', orderId)
        .eq('business_id', user.id)
        .eq('status', 'booked');
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Bestellung bestätigt",
        description: "Sie haben diese Bestellung bestätigt. Der Fahrer kann jetzt mit der Lieferung fortfahren.",
      });
      
      await loadOrders();
    } catch (error: any) {
      console.error("Fehler beim Bestätigen der Bestellung:", error);
      toast({
        title: "Fehler",
        description: error.message || "Die Bestellung konnte nicht bestätigt werden.",
        variant: "destructive",
      });
    }
  };

  // Standortaktualisierung der Bestellung (für Fahrer)
  const updateOrderLocation = async (orderId: string, lat: number, lng: number) => {
    if (!user || user.role !== 'driver') {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          location_lat: lat,
          location_lng: lng,
        })
        .eq('id', orderId)
        .eq('driver_id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Bestellungen aktualisieren (ohne komplettes Neuladen)
      setOrders(prev => prev.map(order => {
        if (order.id === orderId && order.driverId === user.id) {
          return { ...order, location: { lat, lng } };
        }
        return order;
      }));
    } catch (error: any) {
      console.error("Fehler beim Aktualisieren des Standorts:", error);
    }
  };

  // Bestellung als geliefert markieren
  const markOrderDelivered = async (orderId: string) => {
    if (!user) return;

    const isDriver = user.role === 'driver';
    
    try {
      let query = supabase
        .from('orders')
        .update({
          status: 'delivered',
        })
        .eq('id', orderId);
        
      if (isDriver) {
        query = query.eq('driver_id', user.id);
      } else {
        query = query.eq('business_id', user.id);
      }
      
      const { error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (isDriver) {
        toast({
          title: "Bestellung geliefert",
          description: "Sie haben diese Bestellung als geliefert markiert.",
        });
      }
      
      await loadOrders();
    } catch (error: any) {
      console.error("Fehler beim Markieren der Bestellung als geliefert:", error);
      toast({
        title: "Fehler",
        description: error.message || "Die Bestellung konnte nicht als geliefert markiert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        userOrders,
        availableOrders,
        filteredOrders,
        createOrder,
        bookOrder,
        confirmOrder,
        updateOrderLocation,
        markOrderDelivered,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

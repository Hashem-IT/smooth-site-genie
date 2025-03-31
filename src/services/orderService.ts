
import { Order } from "@/types";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { MOCK_ORDERS } from "@/utils/orderUtils";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "easydrop-orders";

export const loadOrders = async (): Promise<Order[]> => {
  console.log("Loading orders from storage or Supabase");
  
  try {
    // Try to load from Supabase first
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Supabase orders fetch error:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("Successfully loaded orders from Supabase:", data.length);
        return data.map(order => ({
          id: order.id,
          businessId: order.business_id,
          businessName: order.business_name,
          name: order.name,
          description: order.description,
          price: order.price,
          weight: order.weight,
          size: order.size,
          imageUrl: order.image_url,
          status: order.status,
          driverId: order.driver_id,
          driverName: order.driver_name,
          createdAt: order.created_at,
          fromAddress: order.from_address,
          toAddress: order.to_address,
          location: order.location_lat && order.location_lng 
            ? { lat: order.location_lat, lng: order.location_lng } 
            : undefined,
        }));
      }
    }
  } catch (err) {
    console.error("Failed to load orders from Supabase:", err);
  }
  
  // Fallback to local storage
  console.log("Falling back to local storage for orders");
  return getFromStorage<Order[]>(STORAGE_KEY, MOCK_ORDERS);
};

export const saveOrders = (orders: Order[]): void => {
  console.log("Saving orders to storage:", orders.length);
  saveToStorage(STORAGE_KEY, orders);
  
  // Additionally try to sync with Supabase if available
  if (supabase) {
    console.log("Attempting to sync orders with Supabase");
  }
};

export const createNewOrder = (
  user: User | null, 
  orderData: Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">
): Order | null => {
  if (!user || user.role !== "business") {
    toast({
      title: "Error",
      description: "Only businesses can create orders",
      variant: "destructive",
    });
    return null;
  }

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    businessId: user.id,
    businessName: user.name,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...orderData,
  };

  console.log("Created new order:", newOrder);
  
  toast({
    title: "Order created",
    description: "Your order has been created successfully.",
  });

  return newOrder;
};

export const bookOrderItem = (
  user: User | null,
  orders: Order[],
  orderId: string
): Order[] => {
  if (!user || user.role !== "driver") {
    toast({
      title: "Error",
      description: "Only drivers can book orders",
      variant: "destructive",
    });
    return orders;
  }

  console.log("Booking order:", orderId, "by driver:", user.id);
  
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId && order.status === "pending") {
      console.log("Found order to book:", order.id);
      return {
        ...order,
        status: "booked" as const,  // Type assertion to ensure correct status type
        driverId: user.id,
        driverName: user.name,
      };
    }
    return order;
  });

  if (updatedOrders.some(order => order.id === orderId && order.status === "booked")) {
    toast({
      title: "Order booked",
      description: "You have successfully booked this order. Wait for confirmation.",
    });
    
    const bookedOrder = updatedOrders.find(order => order.id === orderId);
    if (bookedOrder) {
      const businessNotifications = getFromStorage<Record<string, any[]>>("business-notifications", {});
      
      const notification = {
        id: `notification-${Date.now()}`,
        type: "order-booked",
        orderId: orderId,
        orderName: bookedOrder.name,
        driverName: user.name,
        timestamp: new Date(),
        read: false
      };
      
      if (!businessNotifications[bookedOrder.businessId]) {
        businessNotifications[bookedOrder.businessId] = [];
      }
      
      businessNotifications[bookedOrder.businessId].push(notification);
      saveToStorage("business-notifications", businessNotifications);
    }
  }

  return updatedOrders;
};

export const confirmOrderItem = (
  user: User | null,
  orders: Order[],
  orderId: string
): Order[] => {
  if (!user || user.role !== "business") {
    toast({
      title: "Error",
      description: "Only businesses can confirm orders",
      variant: "destructive",
    });
    return orders;
  }

  console.log("Confirming order:", orderId, "by business:", user.id);
  
  // First, check if the order is in the correct state
  const targetOrder = orders.find(o => o.id === orderId);
  if (!targetOrder) {
    console.error("Order not found:", orderId);
    toast({
      title: "Error",
      description: "Order not found",
      variant: "destructive",
    });
    return orders;
  }
  
  if (targetOrder.businessId !== user.id) {
    console.error("Order doesn't belong to this business");
    toast({
      title: "Error",
      description: "You can only confirm your own orders",
      variant: "destructive",
    });
    return orders;
  }
  
  if (targetOrder.status !== "booked") {
    console.error("Order is not in booked state:", targetOrder.status);
    toast({
      title: "Error",
      description: `Cannot confirm order in ${targetOrder.status} state. Order must be booked first.`,
      variant: "destructive",
    });
    return orders;
  }
  
  // Now perform the update if all checks passed
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId && order.businessId === user.id && order.status === "booked") {
      console.log("Found order to confirm:", order.id);
      return { 
        ...order, 
        status: "confirmed" as const  // Type assertion to ensure correct status type
      };
    }
    return order;
  });

  const orderWasConfirmed = updatedOrders.some(order => order.id === orderId && order.status === "confirmed");
  console.log("Order was confirmed:", orderWasConfirmed);
  
  if (orderWasConfirmed) {
    toast({
      title: "Order confirmed",
      description: "You have confirmed this order. The driver can now proceed with delivery.",
    });
    
    const businessNotifications = getFromStorage<Record<string, any[]>>("business-notifications", {});
    if (businessNotifications[user.id]) {
      businessNotifications[user.id] = businessNotifications[user.id].filter(
        notification => !(notification.type === "order-booked" && notification.orderId === orderId)
      );
      saveToStorage("business-notifications", businessNotifications);
    }
  }

  return updatedOrders;
};

export const updateOrderLocationData = (
  user: User | null,
  orders: Order[],
  orderId: string,
  lat: number,
  lng: number
): Order[] => {
  if (!user || user.role !== "driver") {
    return orders;
  }

  return orders.map((order) => {
    if (order.id === orderId && order.driverId === user.id) {
      return { ...order, location: { lat, lng } };
    }
    return order;
  });
};

export const markOrderAsDelivered = (
  user: User | null,
  orders: Order[],
  orderId: string
): Order[] => {
  if (!user) return orders;

  const isDriver = user.role === "driver";
  
  const updatedOrders = orders.map((order) => {
    if (order.id === orderId) {
      if (isDriver && order.driverId === user.id) {
        return { ...order, status: "delivered" as const };  // Type assertion to ensure correct status type
      } else if (!isDriver && order.businessId === user.id) {
        return { ...order, status: "delivered" as const };  // Type assertion to ensure correct status type
      }
    }
    return order;
  });

  if (isDriver && updatedOrders.some(order => order.id === orderId && order.status === "delivered")) {
    toast({
      title: "Order delivered",
      description: "You have marked this order as delivered.",
    });
  }

  return updatedOrders;
};

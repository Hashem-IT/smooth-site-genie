
import { Order } from "@/types";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { MOCK_ORDERS } from "@/utils/orderUtils";

const STORAGE_KEY = "easydrop-orders";

export const loadOrders = (): Order[] => {
  console.log("Loading orders from storage");
  return getFromStorage<Order[]>(STORAGE_KEY, MOCK_ORDERS);
};

export const saveOrders = (orders: Order[]): void => {
  console.log("Saving orders to storage:", orders.length);
  saveToStorage(STORAGE_KEY, orders);
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

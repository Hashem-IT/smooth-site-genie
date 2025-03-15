
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  availableOrders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">) => void;
  bookOrder: (orderId: string) => void;
  confirmOrder: (orderId: string) => void;
  updateOrderLocation: (orderId: string, lat: number, lng: number) => void;
  markOrderDelivered: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const MOCK_ORDERS: Order[] = [
  {
    id: "order-1",
    businessId: "business-1",
    businessName: "Sample Business",
    name: "Package Delivery",
    description: "Urgent package delivery to downtown",
    price: 15.99,
    weight: 2.5,
    size: "Medium",
    imageUrl: "/placeholder.svg",
    status: "pending",
    createdAt: new Date(),
  },
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const { user } = useAuth();

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem("delivery-connect-orders");
    if (savedOrders) {
      try {
        // Parse the saved orders and ensure dates are properly converted
        const parsedOrders = JSON.parse(savedOrders, (key, value) => {
          if (key === "createdAt") {
            return new Date(value);
          }
          return value;
        });
        setOrders(parsedOrders);
      } catch (error) {
        console.error("Error parsing saved orders:", error);
        setOrders(MOCK_ORDERS);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("delivery-connect-orders", JSON.stringify(orders));
  }, [orders]);

  // Get orders for the current user
  const userOrders = user
    ? orders.filter((order) => {
        if (user.role === "business") {
          return order.businessId === user.id;
        } else {
          return order.driverId === user.id;
        }
      })
    : [];

  // Get available orders for drivers
  const availableOrders = user?.role === "driver"
    ? orders.filter((order) => order.status === "pending")
    : [];

  const createOrder = (orderData: Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">) => {
    if (!user || user.role !== "business") {
      toast({
        title: "Error",
        description: "Only businesses can create orders",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      businessId: user.id,
      businessName: user.name,
      status: "pending",
      createdAt: new Date(),
      ...orderData,
    };

    setOrders((prev) => [...prev, newOrder]);
    toast({
      title: "Order created",
      description: "Your order has been created successfully.",
    });
  };

  const bookOrder = (orderId: string) => {
    if (!user || user.role !== "driver") {
      toast({
        title: "Error",
        description: "Only drivers can book orders",
        variant: "destructive",
      });
      return;
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.status === "pending") {
          return {
            ...order,
            status: "booked",
            driverId: user.id,
            driverName: user.name,
          };
        }
        return order;
      })
    );

    toast({
      title: "Order booked",
      description: "You have successfully booked this order. Wait for confirmation.",
    });
  };

  const confirmOrder = (orderId: string) => {
    if (!user || user.role !== "business") {
      toast({
        title: "Error",
        description: "Only businesses can confirm orders",
        variant: "destructive",
      });
      return;
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.businessId === user.id && order.status === "booked") {
          return { ...order, status: "confirmed" };
        }
        return order;
      })
    );

    toast({
      title: "Order confirmed",
      description: "You have confirmed this order. The driver can now proceed with delivery.",
    });
  };

  const updateOrderLocation = (orderId: string, lat: number, lng: number) => {
    if (!user || user.role !== "driver") {
      return;
    }

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId && order.driverId === user.id) {
          return { ...order, location: { lat, lng } };
        }
        return order;
      })
    );
  };

  const markOrderDelivered = (orderId: string) => {
    if (!user) return;

    const isDriver = user.role === "driver";
    
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          if (isDriver && order.driverId === user.id) {
            return { ...order, status: "delivered" };
          } else if (!isDriver && order.businessId === user.id) {
            return { ...order, status: "delivered" };
          }
        }
        return order;
      })
    );

    if (isDriver) {
      toast({
        title: "Order delivered",
        description: "You have marked this order as delivered.",
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        userOrders,
        availableOrders,
        createOrder,
        bookOrder,
        confirmOrder,
        updateOrderLocation,
        markOrderDelivered,
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

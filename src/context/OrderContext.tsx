
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order } from "@/types";
import { useAuth } from "./AuthContext";
import { filterOrdersByUser, getAvailableOrders, filterOrdersByStatus } from "@/utils/orderUtils";
import { 
  loadOrders, 
  saveOrders, 
  createNewOrder, 
  bookOrderItem, 
  confirmOrderItem,
  updateOrderLocationData,
  markOrderAsDelivered
} from "@/services/orderService";

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  availableOrders: Order[];
  filteredOrders: (status: string) => Order[];
  createOrder: (orderData: Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">) => void;
  bookOrder: (orderId: string) => void;
  confirmOrder: (orderId: string) => void;
  updateOrderLocation: (orderId: string, lat: number, lng: number) => void;
  markOrderDelivered: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  // Load orders from localStorage
  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  // Get orders for the current user
  const userOrders = filterOrdersByUser(orders, user);

  // Get available orders for drivers - should be ALL pending orders, not just the user's
  const availableOrders = user?.role === "driver"
    ? getAvailableOrders(orders)
    : [];

  // Filter orders by status
  const filteredOrders = (status: string) => {
    return filterOrdersByStatus(orders, status);
  };

  const createOrder = (orderData: Omit<Order, "id" | "businessId" | "businessName" | "status" | "createdAt">) => {
    const newOrder = createNewOrder(user, orderData);
    if (newOrder) {
      setOrders((prev) => [...prev, newOrder]);
    }
  };

  const bookOrder = (orderId: string) => {
    setOrders((prev) => bookOrderItem(user, prev, orderId));
  };

  const confirmOrder = (orderId: string) => {
    setOrders((prev) => confirmOrderItem(user, prev, orderId));
  };

  const updateOrderLocation = (orderId: string, lat: number, lng: number) => {
    setOrders((prev) => updateOrderLocationData(user, prev, orderId, lat, lng));
  };

  const markOrderDelivered = (orderId: string) => {
    setOrders((prev) => markOrderAsDelivered(user, prev, orderId));
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

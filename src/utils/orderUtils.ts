
import { Order } from "@/types";
import { User } from "@/types";

export const filterOrdersByUser = (orders: Order[], user: User | null) => {
  if (!user) return [];
  
  return orders.filter((order) => {
    if (user.role === "business") {
      return order.businessId === user.id;
    } else {
      return order.driverId === user.id;
    }
  });
};

export const getAvailableOrders = (orders: Order[]) => {
  return orders.filter((order) => order.status === "pending");
};

export const MOCK_ORDERS: Order[] = [
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

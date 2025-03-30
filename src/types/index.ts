
export type UserRole = "business" | "driver";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Order {
  id: string;
  businessId: string;
  businessName: string;
  driverId: string | null;
  driverName?: string | null;
  name: string;
  description: string;
  price: number;
  weight: number;
  size: string;
  imageUrl?: string;
  fromAddress?: string;
  toAddress?: string;
  status: OrderStatus;
  createdAt: Date | string;
  updatedAt?: string;
  location?: { lat: number; lng: number };
}

// Update the OrderStatus type to match what's expected
export type OrderStatus = "pending" | "booked" | "confirmed" | "delivered";

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: Date;
}

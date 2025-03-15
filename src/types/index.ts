
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
  name: string;
  description: string;
  price: number;
  weight: number;
  size: string;
  imageUrl?: string;
  status: "pending" | "booked" | "confirmed" | "delivered";
  driverId?: string;
  driverName?: string;
  createdAt: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: Date;
}

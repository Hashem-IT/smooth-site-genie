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
  driverId: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Update the OrderStatus type to match what's expected
export type OrderStatus = "pending" | "booked" | "confirmed" | "delivered";

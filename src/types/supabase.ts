
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          business_id: string
          business_name: string
          name: string
          description: string
          price: number
          weight: number
          size: string
          image_url?: string
          status: 'pending' | 'booked' | 'confirmed' | 'delivered'
          driver_id?: string
          driver_name?: string
          created_at: string
          from_address?: string
          to_address?: string
          location_lat?: number
          location_lng?: number
        }
        Insert: {
          id?: string
          business_id: string
          business_name: string
          name: string
          description: string
          price: number
          weight: number
          size: string
          image_url?: string
          status?: 'pending' | 'booked' | 'confirmed' | 'delivered'
          driver_id?: string
          driver_name?: string
          created_at?: string
          from_address?: string
          to_address?: string
          location_lat?: number
          location_lng?: number
        }
        Update: {
          id?: string
          business_id?: string
          business_name?: string
          name?: string
          description?: string
          price?: number
          weight?: number
          size?: string
          image_url?: string
          status?: 'pending' | 'booked' | 'confirmed' | 'delivered'
          driver_id?: string
          driver_name?: string
          created_at?: string
          from_address?: string
          to_address?: string
          location_lat?: number
          location_lng?: number
        }
      }
      messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          sender_name: string
          sender_role: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          sender_name: string
          sender_role: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          text?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'business' | 'driver'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'business' | 'driver'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'business' | 'driver'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

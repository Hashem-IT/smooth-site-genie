
import { Order, Message } from "@/types";
import { supabase } from "@/lib/supabase";

/**
 * Diese Datei enthält Hilfsfunktionen für die Datenspeicherung.
 * Mit Supabase werden diese hauptsächlich für die Offline-Unterstützung
 * oder lokale Zwischenspeicherung verwendet.
 */

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      // Gespeicherte Daten parsen und sicherstellen, dass Daten richtig konvertiert werden
      return JSON.parse(saved, (k, v) => {
        if (k === "createdAt") {
          return new Date(v);
        }
        return v;
      });
    }
    return defaultValue;
  } catch (error) {
    console.error(`Fehler beim Parsen von ${key} aus dem Speicher:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Fehler beim Speichern von ${key} im Speicher:`, error);
  }
};

// Hilfsfunktion zum Konvertieren von Supabase-Order zu App-Order
export const convertDbOrderToAppOrder = (dbOrder: any): Order => {
  return {
    id: dbOrder.id,
    businessId: dbOrder.business_id,
    businessName: dbOrder.business_name,
    name: dbOrder.name,
    description: dbOrder.description,
    price: dbOrder.price,
    weight: dbOrder.weight,
    size: dbOrder.size,
    imageUrl: dbOrder.image_url,
    status: dbOrder.status,
    driverId: dbOrder.driver_id,
    driverName: dbOrder.driver_name,
    createdAt: new Date(dbOrder.created_at),
    fromAddress: dbOrder.from_address,
    toAddress: dbOrder.to_address,
    location: dbOrder.location_lat && dbOrder.location_lng
      ? { lat: dbOrder.location_lat, lng: dbOrder.location_lng }
      : undefined,
  };
};

// Hilfsfunktion zum Konvertieren von App-Order zu Supabase-Order
export const convertAppOrderToDbOrder = (appOrder: Order): any => {
  return {
    id: appOrder.id,
    business_id: appOrder.businessId,
    business_name: appOrder.businessName,
    name: appOrder.name,
    description: appOrder.description,
    price: appOrder.price,
    weight: appOrder.weight,
    size: appOrder.size,
    image_url: appOrder.imageUrl,
    status: appOrder.status,
    driver_id: appOrder.driverId,
    driver_name: appOrder.driverName,
    created_at: typeof appOrder.createdAt === 'string' 
      ? appOrder.createdAt 
      : appOrder.createdAt.toISOString(),
    from_address: appOrder.fromAddress,
    to_address: appOrder.toAddress,
    location_lat: appOrder.location?.lat,
    location_lng: appOrder.location?.lng,
  };
};

// Hilfsfunktion zum Konvertieren von Supabase-Message zu App-Message
export const convertDbMessageToAppMessage = (dbMessage: any): Message => {
  return {
    id: dbMessage.id,
    orderId: dbMessage.order_id,
    senderId: dbMessage.sender_id,
    senderName: dbMessage.sender_name,
    senderRole: dbMessage.sender_role,
    text: dbMessage.text,
    createdAt: new Date(dbMessage.created_at),
  };
};

// Hilfsfunktion zum Konvertieren von App-Message zu Supabase-Message
export const convertAppMessageToDbMessage = (appMessage: Message): any => {
  return {
    id: appMessage.id,
    order_id: appMessage.orderId,
    sender_id: appMessage.senderId,
    sender_name: appMessage.senderName,
    sender_role: appMessage.senderRole,
    text: appMessage.text,
    created_at: appMessage.createdAt.toISOString(),
  };
};

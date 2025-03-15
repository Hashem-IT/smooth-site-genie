
import React, { useEffect, useState } from "react";
import { Order } from "@/types";
import { MapPin, AlertTriangle } from "lucide-react";

interface OrderMapProps {
  order: Order;
}

const OrderMap: React.FC<OrderMapProps> = ({ order }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  useEffect(() => {
    // Simulating map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!order.location) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-md">
        <div className="text-center p-4">
          <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
          <p className="text-muted-foreground">No location data available yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full bg-blue-50 rounded-md overflow-hidden">
      {!isMapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* This is a simulated map for demonstration purposes */}
          <div className="absolute inset-0 bg-blue-50">
            <div className="w-full h-full opacity-50 grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border border-blue-200"></div>
              ))}
            </div>
          </div>
          
          {/* Driver location marker */}
          <div 
            className="absolute animate-pulse"
            style={{ 
              top: `${50 - (order.location.lat - 47) * 25}%`, 
              left: `${(order.location.lng - 15) * 25}%` 
            }}
          >
            <div className="relative">
              <MapPin className="h-8 w-8 text-primary -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-0 left-0 h-2 w-2 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded shadow-md text-xs">
            <p>Lat: {order.location.lat.toFixed(4)}</p>
            <p>Lng: {order.location.lng.toFixed(4)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderMap;

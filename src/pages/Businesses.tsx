
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import OrderForm from "@/components/business/OrderForm";
import BusinessOrderList from "@/components/business/BusinessOrderList";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/context/OrderContext";
import { toast } from "@/hooks/use-toast";

const Businesses = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { loadOrders } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load orders when the page loads and refresh periodically
  useEffect(() => {
    if (isAuthenticated && user?.role === "business") {
      // Initial load
      console.log("Initial orders load");
      loadOrders();
      
      // Set up interval to refresh orders
      const refreshInterval = setInterval(() => {
        console.log("Periodic refresh of orders");
        loadOrders();
      }, 15000); // Refresh every 15 seconds
      
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, user, loadOrders]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    if (isAuthenticated && user?.role === "business") {
      setIsRefreshing(true);
      try {
        console.log("Manual refresh of orders");
        await loadOrders();
        toast({
          title: "Orders refreshed",
          description: "Your order list has been updated with the latest data.",
        });
      } catch (error) {
        console.error("Error refreshing orders:", error);
        toast({
          title: "Refresh failed",
          description: "There was a problem refreshing your orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  // Show a loading state while authentication is being checked
  if (isLoading && !isAuthenticated) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10">
        {isAuthenticated && user?.role === "business" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Business Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome, {user.name}! Manage your delivery orders here.
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleManualRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-4">
              <h2 className="text-xl font-semibold">Your Orders</h2>
              <OrderForm />
            </div>
            
            <BusinessOrderList />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Business Portal</h1>
              <p className="text-muted-foreground mt-2">
                Login or register to manage your delivery orders
              </p>
            </div>
            <AuthForm role="business" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Businesses;

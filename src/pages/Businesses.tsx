
import React from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import OrderForm from "@/components/business/OrderForm";
import BusinessOrderList from "@/components/business/BusinessOrderList";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Businesses = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </>
                )}
              </Button>
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

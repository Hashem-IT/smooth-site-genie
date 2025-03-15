
import React from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import DriverOrderList from "@/components/driver/DriverOrderList";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Drivers = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Layout>
      <div className="container py-10">
        {isAuthenticated && user?.role === "driver" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Driver Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome, {user.name}! Find and manage delivery orders here.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
            
            <div className="py-4">
              <h2 className="text-xl font-semibold mb-4">Orders</h2>
              <DriverOrderList />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Driver Portal</h1>
              <p className="text-muted-foreground mt-2">
                Login or register to start delivering orders
              </p>
            </div>
            <AuthForm role="driver" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Drivers;

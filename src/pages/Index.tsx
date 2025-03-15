
import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Building, Truck } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="container py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Business and Driver Delivery Platform
          </h1>
          <p className="text-xl text-muted-foreground">
            Connect businesses with drivers for efficient and reliable delivery services
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-8 text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">For Businesses</h2>
            <p className="text-muted-foreground mb-6">
              Create and manage delivery orders for your products. Connect with reliable drivers and track your deliveries in real-time.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link to="/businesses">
                Business Portal
              </Link>
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-8 text-center">
            <Truck className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">For Drivers</h2>
            <p className="text-muted-foreground mb-6">
              Find delivery opportunities in your area. Book orders, communicate with businesses, and earn money on your schedule.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link to="/drivers">
                Driver Portal
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Create Orders</h3>
              <p className="text-sm text-muted-foreground">
                Businesses create delivery orders with all necessary details.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Book & Confirm</h3>
              <p className="text-sm text-muted-foreground">
                Drivers book available orders and businesses confirm them.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Deliver & Track</h3>
              <p className="text-sm text-muted-foreground">
                Drivers deliver orders while businesses track progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

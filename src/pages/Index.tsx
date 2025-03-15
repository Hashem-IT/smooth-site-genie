
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Package, Users, Clock, TruckIcon, DollarSign, MapPin } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/70 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Businesses and Drivers for Efficient Deliveries
            </h1>
            <p className="text-xl mb-8">
              Our platform streamlines the delivery process by connecting businesses with reliable drivers, 
              making deliveries faster, more efficient, and cost-effective.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Link to="/businesses">For Businesses</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/drivers">For Drivers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* For Businesses */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Businesses</h3>
                <ol className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Register your business and set up your profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Add your products or services for delivery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Receive and manage orders in real-time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <span>Track deliveries and collect customer feedback</span>
                  </li>
                </ol>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/businesses">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* For Drivers */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <TruckIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">For Drivers</h3>
                <ol className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Sign up as a driver and complete verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Set your availability and delivery preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Browse and accept delivery jobs near you</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">4</span>
                    <span>Complete deliveries and earn money</span>
                  </li>
                </ol>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/drivers">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Platform Features */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Platform Features</h3>
                <ul className="space-y-3 mb-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Real-time order tracking and updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Secure and flexible payment methods</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Rating and review system for quality assurance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Smart route optimization for efficient deliveries</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>24/7 customer and driver support</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/features">Explore Features</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-primary" />
                For Businesses
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Reduce Costs</p>
                    <p className="text-gray-600">No need to hire and maintain your own delivery staff</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Expand Your Reach</p>
                    <p className="text-gray-600">Deliver to a wider area and increase your customer base</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Operational Efficiency</p>
                    <p className="text-gray-600">Streamline your delivery process with our management tools</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 mr-3 text-primary" />
                For Drivers
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Flexible Schedule</p>
                    <p className="text-gray-600">Work when you want and choose your own hours</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Competitive Earnings</p>
                    <p className="text-gray-600">Fair pay structure with opportunities for bonuses</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Local Opportunities</p>
                    <p className="text-gray-600">Choose deliveries in your area to minimize travel</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Delivery Operations?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform today and experience a more efficient, reliable way to connect businesses with drivers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

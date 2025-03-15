
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Package, Clock, Check, MapPin, DollarSign, TruckIcon } from "lucide-react";

const Businesses = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/70 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Streamline Your Deliveries with DeliveryConnect
            </h1>
            <p className="text-xl mb-8">
              Focus on your core business while we handle your delivery logistics with our network of reliable drivers.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/businesses/register">Register Your Business</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Businesses Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cost Efficiency</h3>
              <p className="text-gray-600">
                Eliminate the need for an in-house delivery fleet. Pay only for the deliveries you need, reducing your operational costs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reliable Service</h3>
              <p className="text-gray-600">
                Our vetted drivers ensure timely and professional deliveries, maintaining your reputation for quality service.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Broader Reach</h3>
              <p className="text-gray-600">
                Expand your customer base by offering delivery services to a wider geographic area without additional infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works For Businesses</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 h-full w-px bg-primary/30 transform md:-translate-x-1/2"></div>
              
              {/* Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Register Your Business</h3>
                    <p className="text-gray-600">
                      Create your business profile, add your details, and set up your service area. Quick and easy registration process.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:mx-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>1</span>
                  </div>
                  <div className="order-2 md:order-3 w-full md:w-1/2 md:pl-12">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Registration" className="rounded-lg shadow-md" />
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-3 w-full md:w-1/2 md:pl-12">
                    <h3 className="text-xl font-bold mb-2">Set Up Your Delivery Options</h3>
                    <p className="text-gray-600">
                      Configure your delivery preferences, pricing, and service hours. Define your delivery zones and special instructions.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>2</span>
                  </div>
                  <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Configuration" className="rounded-lg shadow-md" />
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Receive and Manage Orders</h3>
                    <p className="text-gray-600">
                      When an order comes in, it's automatically matched with available drivers. Track the entire process in real-time.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>3</span>
                  </div>
                  <div className="order-2 md:order-3 w-full md:w-1/2 md:pl-12">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Order Management" className="rounded-lg shadow-md" />
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-3 w-full md:w-1/2 md:pl-12">
                    <h3 className="text-xl font-bold mb-2">Complete Deliveries & Get Paid</h3>
                    <p className="text-gray-600">
                      Once deliveries are completed, receive confirmation and feedback. Payments are processed securely and promptly.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>4</span>
                  </div>
                  <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Payment Processing" className="rounded-lg shadow-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-6 text-center">
                <h3 className="text-xl font-bold">Basic</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">5%</span>
                  <span className="text-gray-600 ml-1">per delivery</span>
                </div>
                <p className="text-gray-600">For small businesses</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Up to 50 deliveries per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link to="/businesses/register">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Standard Plan */}
            <div className="border rounded-lg overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="bg-gray-50 p-6 text-center">
                <h3 className="text-xl font-bold">Standard</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">3.5%</span>
                  <span className="text-gray-600 ml-1">per delivery</span>
                </div>
                <p className="text-gray-600">For growing businesses</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Up to 200 deliveries per month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Priority driver matching</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Phone & email support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Customer notifications</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link to="/businesses/register">Get Started</Link>
                </Button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-6 text-center">
                <h3 className="text-xl font-bold">Premium</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">2.5%</span>
                  <span className="text-gray-600 ml-1">per delivery</span>
                </div>
                <p className="text-gray-600">For high-volume businesses</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Unlimited deliveries</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Custom integration options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Priority 24/7 support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Advanced business reports</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Branded delivery experience</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-6">
                  <Link to="/businesses/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution for your business?</p>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Business Partners Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">
                "DeliveryConnect has transformed our delivery operations. We've reduced costs by 30% while expanding our delivery radius."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Bella's Restaurant</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">
                "The platform is incredibly easy to use. We can manage all our deliveries in one place and our customers love the tracking feature."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-500">Green Market Grocery</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="italic text-gray-600 mb-4">
                "The reliability of DeliveryConnect's drivers has helped us improve our customer satisfaction scores significantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Elena Rodriguez</p>
                  <p className="text-sm text-gray-500">Floral Designs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Delivery Operations?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust DeliveryConnect for their delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/businesses/register">Get Started Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Businesses;

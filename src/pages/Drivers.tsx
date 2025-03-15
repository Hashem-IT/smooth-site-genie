
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { TruckIcon, Clock, DollarSign, MapPin, Check } from "lucide-react";

const Drivers = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/70 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Earn Money Your Way with Flexible Deliveries
            </h1>
            <p className="text-xl mb-8">
              Join our network of drivers and start earning by delivering orders on your own schedule.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/drivers/register">Become a Driver</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Drive With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Flexible Schedule</h3>
              <p className="text-gray-600">
                Set your own hours and work when it fits your lifestyle. Be your own boss with complete schedule control.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Earnings</h3>
              <p className="text-gray-600">
                Earn competitive pay for each delivery plus tips. Get paid weekly with transparent earnings tracking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Local Deliveries</h3>
              <p className="text-gray-600">
                Choose deliveries in your area to minimize travel time and maximize your earnings potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works For Drivers</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 h-full w-px bg-primary/30 transform md:-translate-x-1/2"></div>
              
              {/* Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Sign Up as a Driver</h3>
                    <p className="text-gray-600">
                      Complete our simple application process. Provide personal information, vehicle details, and necessary documents.
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
                    <h3 className="text-xl font-bold mb-2">Set Your Availability</h3>
                    <p className="text-gray-600">
                      Let us know when and where you're available to make deliveries. Update your status anytime through the app.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>2</span>
                  </div>
                  <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Availability" className="rounded-lg shadow-md" />
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <h3 className="text-xl font-bold mb-2">Accept Delivery Requests</h3>
                    <p className="text-gray-600">
                      Browse and accept delivery opportunities in your area. Get details about pickup, delivery locations, and expected pay.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>3</span>
                  </div>
                  <div className="order-2 md:order-3 w-full md:w-1/2 md:pl-12">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Accept Deliveries" className="rounded-lg shadow-md" />
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="order-1 md:order-3 w-full md:w-1/2 md:pl-12">
                    <h3 className="text-xl font-bold mb-2">Complete Deliveries & Get Paid</h3>
                    <p className="text-gray-600">
                      Pick up and deliver orders following the app's guidance. Mark deliveries as complete and receive secure, weekly payments.
                    </p>
                  </div>
                  <div className="z-10 order-0 md:order-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <span>4</span>
                  </div>
                  <div className="order-2 md:order-1 w-full md:w-1/2 md:pr-12 md:text-right">
                    <img src="https://placehold.co/600x400/e2e8f0/cccccc" alt="Get Paid" className="rounded-lg shadow-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Earnings Potential</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-4">How Much Can You Earn?</h3>
              <p className="text-gray-600 mb-6">
                Your earnings depend on the number of deliveries you complete, distance traveled, and time of day. Our drivers typically earn:
              </p>
              
              <div className="space-y-4">
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Base pay per delivery</span>
                    <span className="font-bold">$5-15</span>
                  </div>
                  <p className="text-sm text-gray-500">Varies based on distance and complexity</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Average hourly earnings</span>
                    <span className="font-bold">$18-25</span>
                  </div>
                  <p className="text-sm text-gray-500">Based on completing 2-3 deliveries per hour</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Weekly potential (part-time)</span>
                    <span className="font-bold">$300-500</span>
                  </div>
                  <p className="text-sm text-gray-500">Based on 15-20 hours per week</p>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">Weekly potential (full-time)</span>
                    <span className="font-bold">$700-1,000+</span>
                  </div>
                  <p className="text-sm text-gray-500">Based on 35-40 hours per week</p>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                *Earnings estimates are based on average driver performance and may vary by location, time of day, and other factors.
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Earnings Breakdown</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Base Pay</span>
                    <span className="text-primary font-semibold">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Distance Bonus</span>
                    <span className="text-primary font-semibold">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Peak Hours Bonus</span>
                    <span className="text-primary font-semibold">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Customer Tips</span>
                    <span className="text-primary font-semibold">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Additional Earning Opportunities:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Performance bonuses for high customer ratings</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Referral bonuses for bringing in new drivers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Special event and holiday surge payments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Driver Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-4">Basic Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Age Requirement</span>
                    <p className="text-gray-600">Must be at least 18 years old</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Valid Driver's License</span>
                    <p className="text-gray-600">Must have a valid driver's license for your country of residence</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Smartphone</span>
                    <p className="text-gray-600">Compatible iOS or Android device to run the driver app</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Background Check</span>
                    <p className="text-gray-600">Must pass a simple background verification</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Vehicle Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Transportation</span>
                    <p className="text-gray-600">Car, bike, scooter, or motorcycle (varies by city)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Valid Registration</span>
                    <p className="text-gray-600">Vehicle must be properly registered (for cars/motorcycles)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Insurance</span>
                    <p className="text-gray-600">Valid vehicle insurance as required by local regulations</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-semibold">Vehicle Age</span>
                    <p className="text-gray-600">No specific vehicle age requirement (must be in good working condition)</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-center">Required Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Valid government-issued ID or passport</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Driver's license</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Proof of vehicle registration (if applicable)</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Proof of vehicle insurance (if applicable)</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Profile photo for your driver account</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Bank account information for payments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Hear From Our Drivers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">
                "I love the flexibility DeliveryConnect provides. I can work around my university schedule and make enough to cover my expenses."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Alex K.</p>
                  <p className="text-sm text-gray-500">Driver since 2022</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">
                "The app is so easy to use and I appreciate being able to see the delivery details before accepting. Makes my day much more efficient."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Maria S.</p>
                  <p className="text-sm text-gray-500">Driver since 2021</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">
                "After losing my full-time job, DeliveryConnect helped me earn a steady income while I looked for a new position. Now I do both!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold">Thomas B.</p>
                  <p className="text-sm text-gray-500">Driver since 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of drivers who are already enjoying flexible work and competitive pay with DeliveryConnect.
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
            <Link to="/drivers/register">Sign Up as a Driver</Link>
          </Button>
          <p className="mt-6 text-white/80">
            Got questions? <Link to="/contact" className="underline">Contact our support team</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Drivers;


import React from "react";
import Layout from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, MessageSquare, FileText } from "lucide-react";

const Support = () => {
  return (
    <Layout>
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-muted-foreground mb-8">
            Find answers to frequently asked questions or contact our support team.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <HelpCircle className="h-10 w-10 mx-auto text-primary mb-3" />
              <h2 className="text-xl font-semibold mb-2">FAQs</h2>
              <p className="text-muted-foreground mb-4">
                Find answers to common questions in our FAQ section below.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-primary mb-3" />
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Reach out to our support team.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <FileText className="h-10 w-10 mx-auto text-primary mb-3" />
              <h2 className="text-xl font-semibold mb-2">Documentation</h2>
              <p className="text-muted-foreground mb-4">
                Explore our guides and tutorials for detailed information.
              </p>
              <Button variant="outline">View Guides</Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create a business account?</AccordionTrigger>
                <AccordionContent>
                  To create a business account, click on "For Businesses" in the navigation menu, 
                  then select "Register". Fill in your business details including name, email, 
                  and password. Once registered, you can start creating delivery orders immediately.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How do I register as a driver?</AccordionTrigger>
                <AccordionContent>
                  To register as a driver, click on "For Drivers" in the navigation menu, then 
                  select "Register". Complete the registration form with your personal details. 
                  Once registered, you can browse available delivery orders and start accepting jobs.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do payments work?</AccordionTrigger>
                <AccordionContent>
                  For businesses, the payment is collected when a driver accepts and completes your 
                  delivery. Drivers receive their payment after the delivery is confirmed as completed 
                  by the business. All payments are processed securely through our platform.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I cancel an order after it's been created?</AccordionTrigger>
                <AccordionContent>
                  Businesses can cancel orders as long as they haven't been accepted by a driver yet. 
                  Once a driver has accepted the order, you'll need to contact them directly through 
                  our chat system to request cancellation.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How is the delivery price calculated?</AccordionTrigger>
                <AccordionContent>
                  The delivery price is set by the business when creating an order. We recommend 
                  considering factors like distance, size, and weight of the package when determining 
                  an appropriate price. Our system doesn't automatically calculate prices.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>How can I track my delivery?</AccordionTrigger>
                <AccordionContent>
                  Businesses can track their deliveries in real-time through the order details page. 
                  Once a driver accepts and confirms the order, you'll see a "Track" button that 
                  shows the driver's current location on a map.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>What if a package is lost or damaged?</AccordionTrigger>
                <AccordionContent>
                  In the rare event that a package is lost or damaged during delivery, please 
                  contact our support team immediately. We recommend documenting the condition 
                  of packages with photos before and after delivery when possible.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger>How do I contact the driver or business?</AccordionTrigger>
                <AccordionContent>
                  Once an order has been booked by a driver, both parties can communicate directly 
                  through our built-in chat system. Simply click the "Chat" button on the order 
                  details to start a conversation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions? Our support team is ready to help.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;

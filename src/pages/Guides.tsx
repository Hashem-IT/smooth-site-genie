
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Video, BookOpen, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const guides = [
  {
    id: "getting-started",
    title: "Getting Started with EasyDrop",
    description: "Learn the basics of using our platform for businesses and drivers.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    type: "Article",
    readTime: "5 min read",
    content: `
      <h2>Welcome to EasyDrop!</h2>
      <p>This guide will walk you through the basics of using our platform, whether you're a business looking to dispatch deliveries or a driver looking to earn money.</p>
      
      <h3>For Businesses</h3>
      <p>As a business, EasyDrop allows you to easily create delivery orders, track their status, and communicate with drivers. Here's how to get started:</p>
      <ol>
        <li>Create an account by visiting the Businesses page and clicking "Register"</li>
        <li>Once logged in, you'll be able to create delivery orders by clicking "New Order" on your dashboard</li>
        <li>Fill in the order details including pickup and delivery addresses</li>
        <li>Set a fair price for the delivery based on distance, size, and weight</li>
        <li>Once submitted, your order will be visible to drivers in the area</li>
        <li>You'll receive notifications when a driver accepts your order</li>
      </ol>
      
      <h3>For Drivers</h3>
      <p>As a driver, EasyDrop provides you with a steady stream of delivery opportunities. Here's how to get started:</p>
      <ol>
        <li>Create an account by visiting the Drivers page and clicking "Register"</li>
        <li>Complete your profile and verify your information</li>
        <li>Once approved, you can view available orders on your dashboard</li>
        <li>Accept orders that fit your schedule and location</li>
        <li>Use the in-app navigation to complete deliveries efficiently</li>
        <li>Get paid directly through the app after completing deliveries</li>
      </ol>
    `
  },
  {
    id: "creating-orders",
    title: "How to Create Your First Order",
    description: "A step-by-step guide to creating and managing delivery orders.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    type: "Tutorial",
    readTime: "8 min read",
    content: `
      <h2>Creating Your First Delivery Order</h2>
      <p>Creating a delivery order on EasyDrop is simple and straightforward. Follow these steps to get your package on the move!</p>
      
      <h3>Step 1: Access the Order Form</h3>
      <p>From your business dashboard, click the "New Order" button to open the order creation form.</p>
      
      <h3>Step 2: Enter Order Details</h3>
      <ul>
        <li><strong>Name</strong>: Give your order a clear, descriptive name</li>
        <li><strong>Description</strong>: Provide details about what's being delivered</li>
        <li><strong>Size and Weight</strong>: Enter accurate measurements to help drivers prepare</li>
        <li><strong>Price</strong>: Set a competitive price for the delivery service</li>
      </ul>
      
      <h3>Step 3: Specify Addresses</h3>
      <p>Enter both the pickup (from) and delivery (to) addresses. Be as specific as possible, including building names, apartment numbers, and access instructions.</p>
      
      <h3>Step 4: Submit Your Order</h3>
      <p>Review all information and click "Create Order". Your order will now be visible to available drivers.</p>
      
      <h3>Managing Your Order</h3>
      <p>Once created, you can track your order through these stages:</p>
      <ul>
        <li><strong>Pending</strong>: Waiting for a driver to accept the order</li>
        <li><strong>Booked</strong>: A driver has accepted and is waiting for your confirmation</li>
        <li><strong>Confirmed</strong>: You've confirmed the driver and they're now making the delivery</li>
        <li><strong>Delivered</strong>: The order has been successfully delivered</li>
      </ul>
      
      <p>You can communicate with your assigned driver through our in-app chat system at any point after they've accepted your order.</p>
    `
  },
  {
    id: "driver-onboarding",
    title: "Driver Onboarding Process",
    description: "Everything you need to know to start delivering with EasyDrop.",
    icon: <Video className="h-8 w-8 text-primary" />,
    type: "Video",
    readTime: "12 min watch",
    content: `
      <h2>Driver Onboarding Process</h2>
      <p>Welcome to the EasyDrop driver community! This guide will walk you through the entire onboarding process.</p>
      
      <h3>Registration and Verification</h3>
      <p>To become an EasyDrop driver, you'll need to:</p>
      <ol>
        <li>Create an account with your email and personal information</li>
        <li>Provide a valid driver's license and proof of insurance</li>
        <li>Complete a background check (this usually takes 2-3 business days)</li>
        <li>Verify your banking information for payments</li>
      </ol>
      
      <h3>Getting Started</h3>
      <p>Once your account is approved:</p>
      <ol>
        <li>Download our mobile app for on-the-go order management</li>
        <li>Set your availability hours in your profile settings</li>
        <li>Enable location services for better order matching</li>
        <li>Browse available orders on your dashboard</li>
      </ol>
      
      <h3>Accepting and Completing Orders</h3>
      <p>When you see an order you want to accept:</p>
      <ol>
        <li>Review the order details, including pickup/delivery locations and payment</li>
        <li>Click "Accept Order" if you want to take it</li>
        <li>Wait for the business to confirm your booking</li>
        <li>Once confirmed, head to the pickup location</li>
        <li>Use the in-app navigation to find the delivery location</li>
        <li>Mark the order as "Delivered" once complete</li>
      </ol>
      
      <h3>Getting Paid</h3>
      <p>Payments are processed automatically after successful delivery. Funds are typically deposited to your account within 1-2 business days.</p>
    `
  },
  {
    id: "payment-system",
    title: "Payment System Explained",
    description: "Understanding how payments, fees, and driver earnings work.",
    icon: <FileText className="h-8 w-8 text-primary" />,
    type: "Article",
    readTime: "6 min read",
    content: `
      <h2>EasyDrop Payment System</h2>
      <p>Our payment system is designed to be transparent and fair for both businesses and drivers. Here's how it works:</p>
      
      <h3>For Businesses</h3>
      <p>When creating an order, you set the delivery price. This is the total amount you'll pay for the delivery service. Here's the breakdown:</p>
      <ul>
        <li><strong>Driver Payment</strong>: 80% of the total price goes directly to the driver</li>
        <li><strong>Platform Fee</strong>: 15% goes to EasyDrop to maintain and improve the service</li>
        <li><strong>Payment Processing</strong>: 5% covers payment processing fees</li>
      </ul>
      <p>Businesses are charged when a driver completes the delivery. You can set up automatic payments through credit card or bank transfer.</p>
      
      <h3>For Drivers</h3>
      <p>As a driver, you'll receive 80% of the delivery price set by the business. For example, if a business sets a delivery price of $20:</p>
      <ul>
        <li>You'll receive $16 (80% of $20)</li>
        <li>EasyDrop receives $3 (15% of $20)</li>
        <li>Payment processing costs $1 (5% of $20)</li>
      </ul>
      <p>Payments are processed automatically after you mark an order as delivered. Funds typically appear in your account within 1-2 business days.</p>
      
      <h3>Payment Methods</h3>
      <p>EasyDrop supports various payment methods including:</p>
      <ul>
        <li>Credit/debit cards</li>
        <li>Bank transfers (ACH)</li>
        <li>Digital wallets (coming soon)</li>
      </ul>
      
      <h3>Dispute Resolution</h3>
      <p>If there's ever a dispute about payment, our support team is available to help resolve the issue quickly and fairly.</p>
    `
  },
  {
    id: "advanced-business",
    title: "Advanced Features for Businesses",
    description: "Leverage our platform's full potential with these pro tips.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    type: "Guide",
    readTime: "10 min read",
    content: `
      <h2>Advanced Features for Businesses</h2>
      <p>EasyDrop offers powerful features that can help your business optimize its delivery operations. Here's how to leverage them:</p>
      
      <h3>Bulk Order Creation</h3>
      <p>Need to create multiple orders at once? Our bulk order system allows you to:</p>
      <ul>
        <li>Upload a CSV file with multiple delivery details</li>
        <li>Create up to 50 orders simultaneously</li>
        <li>Apply the same settings across multiple orders</li>
      </ul>
      <p>Find this feature in the "Bulk Operations" section of your dashboard.</p>
      
      <h3>Preferred Drivers</h3>
      <p>If you frequently work with specific drivers, you can add them to your "Preferred Drivers" list. This gives them priority access to your orders before they're made available to all drivers.</p>
      
      <h3>Delivery Analytics</h3>
      <p>Track your delivery performance with our analytics dashboard:</p>
      <ul>
        <li>Average delivery time</li>
        <li>Cost per mile</li>
        <li>Driver ratings</li>
        <li>Order volume trends</li>
      </ul>
      <p>Use these insights to optimize your logistics strategy and reduce costs.</p>
      
      <h3>API Integration</h3>
      <p>For businesses with their own systems, we offer API integration to:</p>
      <ul>
        <li>Automatically create orders from your existing systems</li>
        <li>Receive real-time delivery updates</li>
        <li>Sync customer data between platforms</li>
      </ul>
      <p>Contact our support team to get API documentation and integration assistance.</p>
    `
  },
  {
    id: "delivery-efficiency",
    title: "Maximizing Your Delivery Efficiency",
    description: "Tips and tricks for drivers to optimize their delivery routes.",
    icon: <Video className="h-8 w-8 text-primary" />,
    type: "Video",
    readTime: "15 min watch",
    content: `
      <h2>Maximizing Your Delivery Efficiency</h2>
      <p>As an EasyDrop driver, optimizing your delivery efficiency can significantly increase your earnings. Here are expert tips to help you make the most of your time:</p>
      
      <h3>Route Planning</h3>
      <p>Proper route planning is essential for efficient deliveries:</p>
      <ul>
        <li>Look for clusters of orders in similar areas</li>
        <li>Consider traffic patterns and peak hours</li>
        <li>Use our built-in navigation system which automatically optimizes multi-stop routes</li>
        <li>Plan your day to minimize deadhead miles (driving without a delivery)</li>
      </ul>
      
      <h3>Time Management</h3>
      <p>Managing your time effectively can help you complete more deliveries:</p>
      <ul>
        <li>Pre-plan your bathroom and meal breaks</li>
        <li>Set preparation times for each morning before you start</li>
        <li>Keep a consistent schedule to build customer trust</li>
        <li>Use waiting times to plan your next moves</li>
      </ul>
      
      <h3>Vehicle Maintenance</h3>
      <p>A well-maintained vehicle is crucial for delivery efficiency:</p>
      <ul>
        <li>Schedule regular maintenance to prevent breakdowns</li>
        <li>Keep your gas tank at least half full at all times</li>
        <li>Organize your vehicle to easily access packages</li>
        <li>Consider fuel efficiency when choosing a delivery vehicle</li>
      </ul>
      
      <h3>Communication Best Practices</h3>
      <p>Clear communication leads to smoother deliveries:</p>
      <ul>
        <li>Always send an ETA message when you're on your way</li>
        <li>Take clear photos of delivered packages when required</li>
        <li>Communicate any delays immediately</li>
        <li>Be responsive in the chat system for any customer questions</li>
      </ul>
    `
  },
];

const Guides = () => {
  const [selectedGuide, setSelectedGuide] = useState<(typeof guides)[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenGuide = (guide: (typeof guides)[0]) => {
    setSelectedGuide(guide);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">EasyDrop Guides</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive collection of guides, tutorials, and resources to help you make the most of the EasyDrop platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {guide.icon}
                  </div>
                  <CardTitle>{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{guide.type}</span>
                    <span>{guide.readTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleOpenGuide(guide)}
                  >
                    <span>View Guide</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-muted p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-4">
              Our support team is always ready to help with any questions you might have about using EasyDrop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/support">Visit Help Center</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGuide?.icon && React.cloneElement(selectedGuide.icon as React.ReactElement, { className: "h-5 w-5 text-primary" })}
              <span>{selectedGuide?.title}</span>
            </DialogTitle>
            <DialogDescription className="flex justify-between">
              <span>{selectedGuide?.description}</span>
              <span className="text-xs text-muted-foreground">{selectedGuide?.readTime}</span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1">
            <div 
              className="prose dark:prose-invert max-w-none p-1"
              dangerouslySetInnerHTML={{ __html: selectedGuide?.content || "" }}
            />
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Guides
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Guides;

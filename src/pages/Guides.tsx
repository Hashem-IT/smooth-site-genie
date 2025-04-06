
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, Video, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Guides = () => {
  const guides = [
    {
      title: "Getting Started with EasyDrop",
      description: "Learn the basics of using our platform for businesses and drivers.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      type: "Article",
      readTime: "5 min read",
    },
    {
      title: "How to Create Your First Order",
      description: "A step-by-step guide to creating and managing delivery orders.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      type: "Tutorial",
      readTime: "8 min read",
    },
    {
      title: "Driver Onboarding Process",
      description: "Everything you need to know to start delivering with EasyDrop.",
      icon: <Video className="h-8 w-8 text-primary" />,
      type: "Video",
      readTime: "12 min watch",
    },
    {
      title: "Payment System Explained",
      description: "Understanding how payments, fees, and driver earnings work.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      type: "Article",
      readTime: "6 min read",
    },
    {
      title: "Advanced Features for Businesses",
      description: "Leverage our platform's full potential with these pro tips.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      type: "Guide",
      readTime: "10 min read",
    },
    {
      title: "Maximizing Your Delivery Efficiency",
      description: "Tips and tricks for drivers to optimize their delivery routes.",
      icon: <Video className="h-8 w-8 text-primary" />,
      type: "Video",
      readTime: "15 min watch",
    },
  ];

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
            {guides.map((guide, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
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
                  <Button variant="outline" className="w-full">
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
    </Layout>
  );
};

export default Guides;


import React from "react";
import Layout from "@/components/layout/Layout";

const Pricing = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Pricing</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Business Plan</h2>
              <p className="text-3xl font-bold mb-4">$49<span className="text-sm text-muted-foreground">/month</span></p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Unlimited delivery orders
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Real-time tracking
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  In-app messaging with drivers
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Customer notifications
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Order history & analytics
                </li>
              </ul>
            </div>
            
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-semibold mb-2">Driver Commission</h2>
              <p className="text-3xl font-bold mb-4">15%<span className="text-sm text-muted-foreground"> per delivery</span></p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  No monthly fees
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Keep 85% of delivery fees
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Weekly payouts
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  Flexible schedule
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 p-1 rounded-full mr-2">✓</span>
                  In-app support
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Are there any setup fees?</h4>
                <p className="text-muted-foreground mt-1">No, there are no setup fees or hidden costs. You only pay the monthly subscription for businesses or commission for drivers.</p>
              </div>
              <div>
                <h4 className="font-medium">Can I cancel my subscription anytime?</h4>
                <p className="text-muted-foreground mt-1">Yes, you can cancel your subscription at any time. There are no long-term contracts required.</p>
              </div>
              <div>
                <h4 className="font-medium">How are driver payments calculated?</h4>
                <p className="text-muted-foreground mt-1">Drivers receive 85% of the delivery fee. The delivery fee is calculated based on distance, time, and size of the order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;

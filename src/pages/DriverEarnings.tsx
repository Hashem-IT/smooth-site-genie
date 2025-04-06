
import React from "react";
import Layout from "@/components/layout/Layout";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const earningsData = [
  { day: "Mon", amount: 85 },
  { day: "Tue", amount: 120 },
  { day: "Wed", amount: 95 },
  { day: "Thu", amount: 130 },
  { day: "Fri", amount: 180 },
  { day: "Sat", amount: 210 },
  { day: "Sun", amount: 160 }
];

const DriverEarnings = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Driver Earnings</h1>
          
          <div className="bg-card border rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Average Weekly Earnings</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={earningsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Sample earnings chart based on a driver working 30 hours per week
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">How Earnings Work</h2>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="font-medium">Base Pay</h3>
                  <p className="text-muted-foreground mt-1">
                    You receive 85% of the delivery fee paid by customers. The base pay varies depending on distance, time of day, and order size.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium">Tips</h3>
                  <p className="text-muted-foreground mt-1">
                    You keep 100% of all tips from customers. Tips can significantly increase your earnings.
                  </p>
                </div>
                <div className="border-b pb-3">
                  <h3 className="font-medium">Bonuses</h3>
                  <p className="text-muted-foreground mt-1">
                    Earn additional bonuses during peak hours, bad weather, or by completing consecutive deliveries.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Weekly Payouts</h3>
                  <p className="text-muted-foreground mt-1">
                    All earnings are paid out weekly via direct deposit to your bank account.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Earnings Examples</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Part-Time Driver (15-20 hours/week)</h3>
                  <p className="text-muted-foreground mt-1">
                    Average weekly earnings: $350 - $500
                  </p>
                  <ul className="text-sm mt-2">
                    <li>• Approximately 25-35 deliveries per week</li>
                    <li>• Average of $14-16 per delivery including tips</li>
                    <li>• Flexible scheduling, often evenings and weekends</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Full-Time Driver (35-40 hours/week)</h3>
                  <p className="text-muted-foreground mt-1">
                    Average weekly earnings: $700 - $1,200
                  </p>
                  <ul className="text-sm mt-2">
                    <li>• Approximately 60-80 deliveries per week</li>
                    <li>• Average of $14-18 per delivery including tips</li>
                    <li>• Strategic scheduling during peak hours</li>
                    <li>• Potential for higher earnings with experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tips to Maximize Your Earnings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Work During Peak Hours</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Lunch (11am-2pm) and dinner (5pm-9pm) typically have the highest order volumes and potential for better earnings.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Deliver in Busy Areas</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Focus on business districts during lunch hours and residential areas during dinner time.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Provide Excellent Service</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Being friendly and professional typically leads to better tips and higher ratings.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Be Strategic About Acceptance</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider distance, traffic, and payout when deciding which deliveries to accept.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverEarnings;

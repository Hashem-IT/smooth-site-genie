
import React from "react";
import Layout from "@/components/layout/Layout";
import { CheckCircle, AlertCircle } from "lucide-react";

const DriverRequirements = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Driver Requirements</h1>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Basic Requirements</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Must be at least 18 years old</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Valid driver's license with at least 1 year of driving experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Clean driving record (no major violations in the past 3 years)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Background check clearance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Smartphone with data plan (iOS 14+ or Android 8+)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Vehicle Requirements</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Car, scooter, or bike (depending on your delivery zone)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Vehicle must be 20 years old or newer (for cars)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Valid vehicle registration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Current vehicle insurance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Vehicle in good condition, capable of reliable deliveries</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h3 className="font-semibold">Important Insurance Information</h3>
                <p className="text-muted-foreground mt-1">
                  Please be aware that standard personal auto insurance policies may not cover commercial delivery activities. We recommend checking with your insurance provider about delivery coverage options.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Application Process</h2>
            <ol className="space-y-4">
              <li className="flex">
                <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                <div>
                  <h4 className="font-medium">Sign Up</h4>
                  <p className="text-muted-foreground">Create your account and complete the initial application form.</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                <div>
                  <h4 className="font-medium">Background Check</h4>
                  <p className="text-muted-foreground">We'll initiate a background check (typically completed within 3-5 business days).</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                <div>
                  <h4 className="font-medium">Document Verification</h4>
                  <p className="text-muted-foreground">Upload your driver's license, vehicle registration, and insurance documents.</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-primary/10 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5">4</div>
                <div>
                  <h4 className="font-medium">Approval & Activation</h4>
                  <p className="text-muted-foreground">Once approved, you'll receive access to start accepting delivery orders.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DriverRequirements;


import React from "react";
import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <div className="container py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: March 15, 2024
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to DeliveryConnect. These Terms of Service ("Terms") govern your use of our website, 
            products, and services ("Services"). By accessing or using our Services, you agree to be bound 
            by these Terms and our Privacy Policy.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Definitions</h2>
          <p>
            <strong>"DeliveryConnect"</strong> refers to our company, our website, and our delivery platform.
          </p>
          <p>
            <strong>"Business"</strong> refers to any entity that uses our Services to arrange for the delivery of goods.
          </p>
          <p>
            <strong>"Driver"</strong> refers to any individual who uses our Services to provide delivery services.
          </p>
          <p>
            <strong>"User"</strong> refers to any person who accesses or uses our Services, including Businesses and Drivers.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Account Registration</h2>
          <p>
            To use certain features of our Services, you must register for an account. You agree to provide 
            accurate, current, and complete information during the registration process and to update such 
            information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all activities that occur under your 
            account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Business Terms</h2>
          <p>
            Businesses are responsible for providing accurate information about their delivery needs, 
            including but not limited to package dimensions, weight, and delivery location.
          </p>
          <p>
            Businesses are responsible for ensuring that the goods being delivered comply with all 
            applicable laws and regulations.
          </p>
          <p>
            Businesses agree to pay the agreed-upon fee for delivery services provided through our platform.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Driver Terms</h2>
          <p>
            Drivers must be at least 18 years old and have all required licenses and permissions to 
            provide delivery services in their jurisdiction.
          </p>
          <p>
            Drivers are responsible for maintaining their own vehicles and ensuring they have appropriate 
            insurance coverage.
          </p>
          <p>
            Drivers agree to deliver packages in a timely manner and in the same condition as received.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use our Services for any illegal purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Infringe upon the rights of others</li>
            <li>Interfere with or disrupt our Services</li>
            <li>Attempt to gain unauthorized access to our Services</li>
            <li>Use our Services to transmit harmful code or malware</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitations of Liability</h2>
          <p>
            To the maximum extent permitted by law, DeliveryConnect shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
          </p>
          <p>
            DeliveryConnect does not guarantee the quality, safety, or legality of any goods delivered through 
            our platform, nor the reliability, qualifications, or abilities of Drivers.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
          <p>
            We may revise these Terms at any time by posting an updated version on our website. Your continued 
            use of our Services after any such changes constitutes your acceptance of the new Terms.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at: 
            <a href="mailto:legal@deliveryconnect.com" className="text-primary hover:underline ml-1">
              legal@deliveryconnect.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;

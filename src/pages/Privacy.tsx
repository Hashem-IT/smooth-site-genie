
import React from "react";
import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="container py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: March 15, 2024
          </p>
          
          <p className="lead mb-6">
            At DeliveryConnect, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, and share your personal information when you use our website and services.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account</li>
            <li>Complete your profile</li>
            <li>Create or accept delivery orders</li>
            <li>Communicate through our platform</li>
            <li>Contact our support team</li>
          </ul>
          <p>
            This information may include your name, email address, phone number, address, 
            payment information, and any other information you choose to provide.
          </p>
          
          <p>
            We also automatically collect certain information when you use our Services, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Log data (such as IP address, browser type, pages visited)</li>
            <li>Device information</li>
            <li>Location data (with your permission)</li>
            <li>Cookie and similar technology data</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our Services</li>
            <li>Process transactions and send related information</li>
            <li>Connect businesses with drivers</li>
            <li>Send administrative messages and communications</li>
            <li>Respond to your comments and questions</li>
            <li>Provide customer support</li>
            <li>Send promotional messages (you can opt out)</li>
            <li>Monitor and analyze trends and usage</li>
            <li>Detect and prevent fraudulent transactions and activities</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Sharing Your Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Other users as needed to fulfill services (e.g., businesses and drivers)</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Professional advisors (lawyers, accountants, etc.)</li>
            <li>In response to legal process or to protect our rights</li>
            <li>In connection with a merger, sale, or acquisition</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights and Choices</h2>
          <p>
            You have certain rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access and update your information through your account settings</li>
            <li>Opt out of marketing communications</li>
            <li>Request deletion of your account and personal information</li>
            <li>Object to certain uses of your information</li>
            <li>Where applicable, exercise rights under data protection laws</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security 
            of your personal information. However, no security system is impenetrable, and we cannot 
            guarantee the security of our systems 100%.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">International Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than the one in 
            which you reside. These countries may have different data protection laws.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: 
            <a href="mailto:privacy@deliveryconnect.com" className="text-primary hover:underline ml-1">
              privacy@deliveryconnect.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;

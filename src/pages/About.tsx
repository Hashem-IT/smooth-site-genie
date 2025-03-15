
import React from "react";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="container py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About DeliveryConnect</h1>
        
        <div className="prose prose-lg">
          <p className="lead text-xl mb-6">
            DeliveryConnect is a platform that connects businesses with independent 
            drivers to provide efficient and reliable delivery services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            Our mission is to simplify logistics for businesses while creating flexible 
            earning opportunities for drivers. We believe in creating a seamless connection 
            between businesses and drivers that benefits everyone involved.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">For Businesses</h3>
              <p>
                Businesses can create an account, upload their delivery orders, and connect 
                with available drivers. They can track deliveries in real-time and 
                communicate directly with drivers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">For Drivers</h3>
              <p>
                Drivers can sign up, browse available orders, and choose deliveries that 
                fit their schedule. They can communicate with businesses and earn money 
                on their own terms.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            DeliveryConnect was founded by a team of logistics experts and technology 
            enthusiasts who recognized the need for a more efficient delivery solution 
            in the market. Our team is dedicated to continuously improving the platform 
            to meet the needs of our users.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            We're always looking to improve our service. If you have any questions, 
            suggestions, or feedback, please don't hesitate to contact us at 
            <a href="mailto:info@deliveryconnect.com" className="text-primary font-medium ml-1">
              info@deliveryconnect.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

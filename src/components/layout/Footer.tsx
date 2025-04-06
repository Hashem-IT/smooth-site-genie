
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EasyDrop</h3>
            <p className="text-gray-400 mb-4">
              Connecting businesses and drivers to provide efficient and reliable delivery services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Businesses</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/businesses" className="text-gray-400 hover:text-white transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="text-gray-400 hover:text-white transition-colors">
                  Register Your Business
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">For Drivers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/drivers" className="text-gray-400 hover:text-white transition-colors">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link to="/drivers/requirements" className="text-gray-400 hover:text-white transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link to="/drivers/earnings" className="text-gray-400 hover:text-white transition-colors">
                  Earnings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-400 hover:text-white transition-colors">
                  View Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} EasyDrop. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl text-primary flex items-center gap-2">
            <img alt="EasyDrop Logo" src="/lovable-uploads/1451c6b2-b907-4155-88b0-d65cb7dfbfff.png" className="h-10 w-auto rounded-full" />
            <span>EasyDrop</span>
          </Link>

          {isMobile ? <>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X /> : <MenuIcon />}
              </Button>
              
              {isMenuOpen && <div className="absolute top-16 left-0 right-0 bg-white shadow-md py-4 px-4 z-50">
                  <div className="flex flex-col space-y-4">
                    <Link to="/" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Home
                    </Link>
                    <Link to="/businesses" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      For Businesses
                    </Link>
                    <Link to="/drivers" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      For Drivers
                    </Link>
                    <Link to="/about" className="text-gray-700 hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                      About Us
                    </Link>
                  </div>
                </div>}
            </> : <>
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/businesses" className="text-gray-700 hover:text-primary transition-colors">
                  For Businesses
                </Link>
                <Link to="/drivers" className="text-gray-700 hover:text-primary transition-colors">
                  For Drivers
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">
                  About Us
                </Link>
              </div>
            </>}
        </div>
      </div>
    </nav>;
};
export default Navbar;
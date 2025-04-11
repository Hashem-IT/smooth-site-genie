
import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import Businesses from './pages/Businesses';
import Drivers from './pages/Drivers';
import Pricing from './pages/Pricing';
import DriverRequirements from './pages/DriverRequirements';
import DriverEarnings from './pages/DriverEarnings';
import Guides from './pages/Guides';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        {/* ChatProvider remains for compatibility but has no functionality */}
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/businesses" element={<Businesses />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/drivers/requirements" element={<DriverRequirements />} />
            <Route path="/drivers/earnings" element={<DriverEarnings />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ChatProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;

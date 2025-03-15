
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Businesses from "./pages/Businesses";
import Drivers from "./pages/Drivers";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { ChatProvider } from "./context/ChatContext";

const queryClient = new QueryClient();

// Update localStorage key to match new app name
const updateLocalStorageKeys = () => {
  if (localStorage.getItem("delivery-connect-user")) {
    const userData = localStorage.getItem("delivery-connect-user");
    localStorage.setItem("easydrop-user", userData || "");
    localStorage.removeItem("delivery-connect-user");
  }
  
  if (localStorage.getItem("delivery-connect-orders")) {
    const ordersData = localStorage.getItem("delivery-connect-orders");
    localStorage.setItem("easydrop-orders", ordersData || "");
    localStorage.removeItem("delivery-connect-orders");
  }
};

// Run once on app initialization
updateLocalStorageKeys();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <OrderProvider>
            <ChatProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/businesses" element={<Businesses />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ChatProvider>
          </OrderProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

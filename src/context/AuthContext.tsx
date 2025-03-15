
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "business-1",
    email: "business@example.com",
    name: "Sample Business",
    role: "business",
  },
  {
    id: "driver-1",
    email: "driver@example.com",
    name: "Sample Driver",
    role: "driver",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("delivery-connect-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.role === role
      );
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("delivery-connect-user", JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        
        // Navigate based on role
        if (role === "business") {
          navigate("/businesses");
        } else {
          navigate("/drivers");
        }
      } else {
        // For demo purposes, create a new user if not found
        const newUser: User = {
          id: `${role}-${Date.now()}`,
          email,
          name: email.split("@")[0],
          role,
        };
        
        MOCK_USERS.push(newUser);
        setUser(newUser);
        localStorage.setItem("delivery-connect-user", JSON.stringify(newUser));
        
        toast({
          title: "Login successful",
          description: `Welcome, ${newUser.name}!`,
        });
        
        // Navigate based on role
        if (role === "business") {
          navigate("/businesses");
        } else {
          navigate("/drivers");
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = MOCK_USERS.some(
        (u) => u.email === email && u.role === role
      );
      
      if (userExists) {
        toast({
          title: "Registration failed",
          description: "User with this email already exists.",
          variant: "destructive",
        });
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `${role}-${Date.now()}`,
        email,
        name,
        role,
      };
      
      MOCK_USERS.push(newUser);
      setUser(newUser);
      localStorage.setItem("delivery-connect-user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      // Navigate based on role
      if (role === "business") {
        navigate("/businesses");
      } else {
        navigate("/drivers");
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("delivery-connect-user");
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

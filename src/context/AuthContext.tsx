
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on first load
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          console.log("User signed in, fetching profile");
          // Use maybeSingle instead of single to prevent errors when multiple or no rows are returned
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
          }
            
          if (profile) {
            console.log("Profile found:", profile);
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role as UserRole,
            };
            
            setUser(userData);
          } else {
            console.log("No profile found for user:", session.user.id);
          }
        } catch (error) {
          console.error("Error in auth state change handler:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session:", session.user.id);
          
          // Use maybeSingle instead of single to prevent errors when multiple or no rows are returned
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          } else if (profile) {
            console.log("Profile found for existing session:", profile);
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role as UserRole,
            };
            
            setUser(userData);
          } else {
            console.log("No profile found for session user:", session.user.id);
          }
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Clean up
    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log("Login attempt with:", { email, role });
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        throw error;
      }
      
      console.log("Supabase auth success:", data);
      
      // Fetch profile using maybeSingle instead of single
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }
      
      console.log("Profile data:", profile);
      
      if (!profile) {
        await supabase.auth.signOut();
        throw new Error("Profil nicht gefunden. Bitte registrieren Sie sich zuerst.");
      }
      
      // Role check
      if (profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`Sie haben sich als ${role === 'business' ? 'Unternehmen' : 'Fahrer'} angemeldet, aber Ihr Konto ist als ${profile.role === 'business' ? 'Unternehmen' : 'Fahrer'} registriert.`);
      }
      
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      };
      
      setUser(userData);
      
      toast({
        title: "Anmeldung erfolgreich",
        description: `Willkommen zurück, ${profile.name}!`,
      });
      
      // Navigate based on role
      if (role === "business") {
        navigate("/businesses");
      } else {
        navigate("/drivers");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message || "Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      console.log("Register attempt with:", { name, email, role });
      
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        throw error;
      }
      
      console.log("Supabase signup response:", data);
      
      if (!data.user) {
        throw new Error("Registrierung fehlgeschlagen");
      }
      
      // The profile is created automatically through the database trigger
      // Wait briefly to ensure the trigger has time to execute
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch the newly created profile using maybeSingle
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (profileError || !profile) {
        console.error("Profile creation error:", profileError || "No profile found");
        console.log("Profile data:", profile);
        // Try to clean up the auth user if profile creation fails
        throw new Error("Fehler bei der Profilerstellung. Bitte versuchen Sie es erneut.");
      }
      
      const userData: User = {
        id: data.user.id,
        email,
        name,
        role,
      };
      
      setUser(userData);
      
      toast({
        title: "Registrierung erfolgreich",
        description: `Willkommen, ${name}!`,
      });
      
      // Navigate based on role
      if (role === "business") {
        navigate("/businesses");
      } else {
        navigate("/drivers");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bei der Registrierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: error.message || "Abmeldung fehlgeschlagen.",
        variant: "destructive",
      });
    }
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

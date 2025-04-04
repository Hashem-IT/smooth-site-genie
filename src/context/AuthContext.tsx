
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on first load
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.id);
      
      // We need to use setTimeout to prevent deadlocks in the Supabase client
      // This defers processing until after the event has completed
      setTimeout(async () => {
        if (event === 'SIGNED_IN' && newSession) {
          try {
            console.log("User signed in, fetching profile");
            // Use maybeSingle instead of single to prevent errors when multiple or no rows are returned
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .maybeSingle();
              
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              setIsLoading(false); // Make sure to set loading to false on error
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
              setSession(newSession);
            } else {
              console.log("No profile found for user:", newSession.user.id);
              // Clear session when no profile is found
              await supabase.auth.signOut();
              setUser(null);
              setSession(null);
            }
            
            setIsLoading(false); // Set loading to false after successful sign-in
          } catch (error) {
            console.error("Error in auth state change handler:", error);
            setIsLoading(false); // Make sure to set loading to false on error
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          setSession(null);
          setIsLoading(false); // Set loading to false after sign-out
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
          setSession(newSession);
        }
      }, 0);
    });
    
    // Then check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        console.log("Checking for existing session");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log("Found existing session:", existingSession.user.id);
          
          // Use maybeSingle instead of single to prevent errors when multiple or no rows are returned
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingSession.user.id)
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
            setSession(existingSession);
          } else {
            console.log("No profile found for session user:", existingSession.user.id);
            // Sign out if no profile exists for this user
            await supabase.auth.signOut();
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
        setIsLoading(false); // Make sure to set loading to false on error
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
        setIsLoading(false); // Make sure to set loading to false on error
        throw profileError;
      }
      
      console.log("Profile data:", profile);
      
      if (!profile) {
        await supabase.auth.signOut();
        setIsLoading(false); // Make sure to set loading to false when there's no profile
        throw new Error("Profil nicht gefunden. Bitte registrieren Sie sich zuerst.");
      }
      
      // Role check
      if (profile.role !== role) {
        await supabase.auth.signOut();
        setIsLoading(false); // Make sure to set loading to false when role doesn't match
        throw new Error(`Sie haben sich als ${role === 'business' ? 'Unternehmen' : 'Fahrer'} angemeldet, aber Ihr Konto ist als ${profile.role === 'business' ? 'Unternehmen' : 'Fahrer'} registriert.`);
      }
      
      const userData: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
      };
      
      setUser(userData);
      setSession(data.session);
      
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
      throw error; // Re-throw the error so it can be caught by the form component
    } finally {
      setIsLoading(false); // Always ensure loading state is reset
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
        setIsLoading(false); // Make sure to set loading to false on error
        throw error;
      }
      
      console.log("Supabase signup response:", data);
      
      if (!data.user) {
        setIsLoading(false); // Make sure to set loading to false when there's no user
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
        setIsLoading(false); // Make sure to set loading to false on error
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
      setSession(data.session);
      
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
      throw error; // Re-throw the error so it can be caught by the form component
    } finally {
      setIsLoading(false); // Always ensure loading state is reset
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
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
    } finally {
      setIsLoading(false); // Always ensure loading state is reset
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

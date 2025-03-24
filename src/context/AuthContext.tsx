
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

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

  // Überprüfen des Authentifizierungsstatus beim ersten Laden
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      
      // Aktuelle Sitzung abrufen
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Fehler beim Abrufen der Sitzung:", error);
        setIsLoading(false);
        return;
      }
      
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error("Fehler beim Abrufen des Profils:", profileError);
          setIsLoading(false);
          return;
        }
        
        if (profile) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          };
          
          setUser(userData);
        }
      }
      
      setIsLoading(false);
    };
    
    // Einmaliges Überprüfen beim Laden
    checkSession();
    
    // Auf Authentifizierungsänderungen hören
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
          };
          
          setUser(userData);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Aufräumen
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Bei Supabase anmelden
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Profil abrufen
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        throw profileError;
      }
      
      // Rollenüberprüfung
      if (profile.role !== role) {
        await supabase.auth.signOut();
        throw new Error(`Sie haben sich als ${role} angemeldet, aber Ihr Konto ist als ${profile.role} registriert.`);
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
      
      // Je nach Rolle navigieren
      if (role === "business") {
        navigate("/businesses");
      } else {
        navigate("/drivers");
      }
    } catch (error: any) {
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
      // Bei Supabase registrieren
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error("Benutzerregistrierung fehlgeschlagen");
      }
      
      // Profil in der Datenbank erstellen
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          name,
          role,
          created_at: new Date().toISOString(),
        });
        
      if (profileError) {
        // Bereinigen bei Fehler
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
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
      
      // Je nach Rolle navigieren
      if (role === "business") {
        navigate("/businesses");
      } else {
        navigate("/drivers");
      }
    } catch (error: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Ein Fehler ist bei der Registrierung aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet.",
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

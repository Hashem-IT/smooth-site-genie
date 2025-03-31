
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types";
import PasswordInput from "./PasswordInput";
import PasswordStrengthChecker from "./PasswordStrengthChecker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  role: UserRole;
}

const AuthForm: React.FC<AuthFormProps> = ({ role }) => {
  const { login, register, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [error, setError] = useState<string | null>(null);
  // Initialize with 'connected' instead of 'checking' to avoid unnecessary loading state
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('connected');
  
  // Check Supabase connection only if there's an error or explicit need
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple health check - try to get version info
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionStatus('error');
          setError("Datenbank-Verbindungsfehler. Bitte versuchen Sie es später erneut.");
        } else {
          console.log("Supabase connection successful");
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error("Supabase connection check failed:", err);
        setConnectionStatus('error');
        setError("Verbindung zum Authentifizierungsdienst nicht möglich. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.");
      }
    };
    
    // Only check connection if we're showing the form
    checkConnection();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (connectionStatus === 'error') {
      setError("Authentifizierung nicht möglich, während keine Verbindung zur Datenbank besteht. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.");
      return;
    }
    
    try {
      console.log("Form submitted:", { isRegister, email, password, selectedRole });
      if (isRegister) {
        await register(name, email, password, selectedRole);
      } else {
        await login(email, password, selectedRole);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setError(error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    }
  };
  
  // Only show loading state if explicitly checking connection
  if (connectionStatus === 'checking') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isRegister ? "Konto erstellen" : "Anmelden"}</CardTitle>
          <CardDescription>
            Verbindung zum Authentifizierungsdienst wird hergestellt...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Sichere Verbindung wird hergestellt...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isRegister ? "Konto erstellen" : "Anmelden"}</CardTitle>
        <CardDescription>
          {isRegister
            ? "Geben Sie Ihre Daten ein, um ein neues Konto zu erstellen"
            : "Geben Sie Ihre Anmeldedaten ein, um auf Ihr Konto zuzugreifen"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {connectionStatus === 'error' && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Keine Verbindung zum Authentifizierungsdienst möglich. Bitte überprüfen Sie Ihre Internetverbindung und aktualisieren Sie die Seite.
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Geben Sie Ihren Namen ein"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Geben Sie Ihre E-Mail ein"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Geben Sie Ihr Passwort ein"
            />
            {isRegister && <PasswordStrengthChecker password={password} />}
          </div>
          
          <div className="space-y-2">
            <Label>Ich bin ein:</Label>
            <RadioGroup
              defaultValue={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business">Unternehmen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver" id="driver" />
                <Label htmlFor="driver">Fahrer</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-11 mt-6 text-base font-medium shadow-sm hover:shadow-md"
            variant="default"
            size="lg"
            disabled={isLoading || connectionStatus === 'error'}
          >
            {isLoading
              ? "Laden..."
              : isRegister
              ? "Konto erstellen"
              : "Anmelden"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          onClick={() => setIsRegister(!isRegister)}
          disabled={isLoading}
          className="text-primary font-medium"
        >
          {isRegister
            ? "Haben Sie bereits ein Konto? Anmelden"
            : "Haben Sie kein Konto? Registrieren"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;


import React, { useState } from "react";
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
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
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Laden...
              </span>
            ) : isRegister ? (
              "Konto erstellen"
            ) : (
              "Anmelden"
            )}
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


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
import { AlertCircle } from "lucide-react";

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
        <CardTitle>{isRegister ? "Create an account" : "Log in"}</CardTitle>
        <CardDescription>
          {isRegister
            ? "Enter your details to create a new account"
            : "Enter your credentials to access your account"}
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
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {isRegister && <PasswordStrengthChecker password={password} />}
          </div>
          
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup
              defaultValue={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="business" id="business" />
                <Label htmlFor="business">Business</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver" id="driver" />
                <Label htmlFor="driver">Driver</Label>
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
            {isLoading
              ? "Loading..."
              : isRegister
              ? "Create account"
              : "Log in"}
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
            ? "Already have an account? Log in"
            : "Don't have an account? Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

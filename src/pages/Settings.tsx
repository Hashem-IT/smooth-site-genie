
import React from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoUpload from "@/components/settings/LogoUpload";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@example.com";

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        {!isAdmin && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              You need administrator access to view and modify these settings.
            </AlertDescription>
          </Alert>
        )}
        
        {isAdmin && (
          <Tabs defaultValue="appearance">
            <TabsList className="mb-6">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Logo</h2>
                <LogoUpload />
              </div>
            </TabsContent>
            
            <TabsContent value="general">
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <p className="text-muted-foreground">Additional settings coming soon.</p>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Settings;

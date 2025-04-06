
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LogoUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a logo image to upload.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload to public folder
      const { data, error } = await supabase.storage
        .from('public')
        .upload(`logo.png`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage.from('public').getPublicUrl('logo.png');

      toast({
        title: "Logo updated",
        description: "Your logo has been uploaded successfully.",
      });

      // Force reload to show new logo
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your logo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Logo</CardTitle>
        <CardDescription>
          Upload your company logo to display on the website.
          The logo should be a PNG or JPG file with transparent background.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preview && (
          <div className="mb-4 flex justify-center">
            <img 
              src={preview} 
              alt="Logo preview" 
              className="max-h-32 object-contain border rounded p-2" 
            />
          </div>
        )}
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground">
            Recommended size: 200x80px. Maximum file size: 2MB.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LogoUpload;


import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const BusinessChatList = ({ orderId }: { orderId: string }) => {
  return (
    <div className="text-center p-4">
      <Card className="p-4">
        <CardContent className="flex flex-col items-center justify-center gap-2 pt-6">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            Chat functionality has been removed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessChatList;

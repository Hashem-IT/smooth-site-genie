
import React from "react";
import { AlertCircle } from "lucide-react";

interface ChatInterfaceProps {
  orderId: string;
  partnerId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  return (
    <div className="flex flex-col h-[400px] max-h-[400px] items-center justify-center">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">
        Chat functionality has been removed.
      </p>
    </div>
  );
};

export default ChatInterface;


import React from 'react';

// Creating an empty provider to avoid breaking existing imports
const ChatContext = React.createContext<any>({});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useChat = () => {
  // Return an empty object with orderMessages function that returns an empty array
  return {
    orderMessages: () => []
  };
};

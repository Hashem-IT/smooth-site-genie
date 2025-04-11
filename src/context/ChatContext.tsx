
// This file has been emptied as the chat functionality has been removed
import React from 'react';

// Creating an empty provider to avoid breaking existing imports
const ChatContext = React.createContext<any>({});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useChat = () => {
  return {};
};

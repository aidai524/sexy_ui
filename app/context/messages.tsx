"use client";

import React, { useContext } from "react";
import type { ReactNode } from "react";
import useNum from "../components/messages/use-num";

const MessageContext = React.createContext<any | null>(null);

export const MessageProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { num, onQuery } = useNum();

  return (
    <MessageContext.Provider
      value={{
        num,
        onQuery
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export function useMessages() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("");
  }

  return context;
}

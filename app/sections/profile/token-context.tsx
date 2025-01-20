"use client";

import React, { useContext, useState } from "react";
import type { ReactNode } from "react";

const TokenActionsContext = React.createContext<any | null>(null);

export const TokenActionsProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [currentToken, setCurrentToken] = useState<any>();
  return (
    <TokenActionsContext.Provider
      value={{
        showTradeModal,
        currentToken,
        onClick(type: string, token: any) {
          setCurrentToken(token);
          if (type === "trade") {
            setShowTradeModal(true);
          }
        },
        onCloseTradeModal() {
          setShowTradeModal(false);
        }
      }}
    >
      {children}
    </TokenActionsContext.Provider>
  );
};

export function useTokenActions() {
  const context = useContext(TokenActionsContext);

  if (!context) {
    throw new Error("");
  }

  return context;
}

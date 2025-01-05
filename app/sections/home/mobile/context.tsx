import React, { useContext } from "react";

export const HomeContext = React.createContext<any | null>(null);

export function useHome() {
  const context = useContext(HomeContext);

  return context || {};
}

import React, { useContext } from "react";
import { useUserAgent } from "./user-agent";

export const LaptopContext = React.createContext<any | null>(null);

export function useLaptop() {
  const context = useContext(LaptopContext);
  const { isMobile } = useUserAgent();

  if (!context) {
    throw new Error("");
  }
  if (isMobile) return {};
  return context;
}

"use client";

import React, { useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const UserAgentContext = React.createContext<any | null>(null);

export const UserAgentProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>();
  const [innerHeight, setInnerHeight] = useState<number>(0);
  const [innerWidth, setInnerWidth] = useState<number>(0);

  useEffect(() => {
    const checkIsMobile = () => {
      const _isMobile =
        window.navigator.userAgent.includes("Mobile") ||
        window.innerWidth < 450;
      setIsMobile(_isMobile);
      setInnerHeight(_isMobile ? window.innerHeight - 72 : 680);
      setInnerWidth(_isMobile ? window.innerWidth : 426);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <UserAgentContext.Provider value={{ isMobile, innerHeight, innerWidth }}>
      {isMobile !== undefined && children}
    </UserAgentContext.Provider>
  );
};

export function useUserAgent() {
  const context = useContext(UserAgentContext);

  if (!context) {
    throw new Error("");
  }

  return context;
}

import React, { useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const UserAgentContext = React.createContext<any | null>(null);

export const UserAgentProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>();
  const [innerHeight, setInnerHeight] = useState<number>(0);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(
        window.navigator.userAgent.includes("Mobile") || window.innerWidth < 450
      );
    };

    checkIsMobile();
    setInnerHeight(window.innerHeight);
    console.log("innerHeight", window.innerHeight, window.screen);
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <UserAgentContext.Provider value={{ isMobile, innerHeight }}>
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

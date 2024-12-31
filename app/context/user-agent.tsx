import React, { useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


const UserAgentContext = React.createContext<any | null>(null);

export const UserAgentProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.navigator.userAgent.includes("Mobile"));
      // setIsMobile(false);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <UserAgentContext.Provider value={{ isMobile }}>
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

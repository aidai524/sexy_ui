import React, { useContext, useEffect, useState } from "react";
import { useUserAgent } from "./user-agent";
import { usePathname } from "next/navigation";

export const FlipContext = React.createContext<any | null>(null);

export const FlipProvider = ({ children }: any) => {
  const [isFlip, setIsFlip] = useState(false);
  const [params, setParams] = useState<any>({});
  const pathname = usePathname();

  const onChangeFlip = (flip: boolean, args: any) => {
    setIsFlip(flip);
    setParams(args);
  };

  useEffect(() => {
    setIsFlip(false);
    setParams({});
  }, [pathname]);

  return (
    <FlipContext.Provider value={{ isFlip, onChangeFlip, params }}>
      {children}
    </FlipContext.Provider>
  );
};

export function useFlip() {
  const context = useContext(FlipContext);
  const { isMobile } = useUserAgent();

  if (!isMobile || !context) return {};
  return context;
}

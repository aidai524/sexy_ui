"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";

export default memo(function Slippage(props: any) {
  const { isMobile } = useUserAgent();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
});

"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";

export default memo(function Home(props: any) {
  const { isMobile } = useUserAgent();
  return isMobile ? <div style={{ overflow: 'auto', height: '100vh' }}><Mobile {...props} /></div> : <Laptop {...props} />;
});

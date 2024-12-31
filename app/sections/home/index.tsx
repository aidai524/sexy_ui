"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop/main";
import { useUserAgent } from "@/app/context/user-agent";

export default memo(function Home(props: any) {
  const { isMobile } = useUserAgent();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
});

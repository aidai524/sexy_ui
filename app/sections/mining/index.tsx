"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import useUserMining from "./use-user-mining";
import { useUserAgent } from "@/app/context/user-agent";

export default memo(function Mining(props: any) {
  const { isMobile } = useUserAgent();
  const { info, loading: infoLoading } = useUserMining();

  const params = {
    info,
    infoLoading
  };
  return isMobile ? (
    <Mobile {...props} {...params} />
  ) : (
    <Laptop {...props} {...params} />
  );
});

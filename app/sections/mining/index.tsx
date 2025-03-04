"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop/index";
import useReferralRate from "./use-referral-rate";
import useUserMining from "./use-user-mining";
import { useUserAgent } from "@/app/context/user-agent";
import { useAuth } from "@/app/context/auth";

export default memo(function Mining(props: any) {
  const { isMobile } = useUserAgent();
  const { info, loading: infoLoading } = useUserMining();
  const { isLoading: rateLoading, rate } = useReferralRate();
  const { userInfo } = useAuth();

  const params = {
    info,
    infoLoading,
    rate,
    rateLoading,
    userInfo
  };

  return isMobile ? (
    <Mobile {...props} {...params} />
  ) : (
    <Laptop {...props} {...params} />
  );
});

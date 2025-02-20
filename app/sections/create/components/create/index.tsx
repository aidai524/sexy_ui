"use client";

import { memo, useCallback } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { httpGet } from "@/app/utils";
import { useMessage } from "@/app/context/messageContext";
import { mapDataToProject } from "@/app/utils/mapTo";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";

export default memo(function Create(props: any) {
  const router = useRouter();
  const { isMobile } = useUserAgent();
  const { showShare } = useMessage();

  const { tokenInfo } = useTokenTrade({
    tokenName: props.token.tokenName,
    tokenSymbol: props.token.tokenSymbol,
    tokenDecimals: props.token.tokenDecimals,
    loadData: false
  })

  const share = useCallback(async () => {
    if (props) {
      const tokenAddress = tokenInfo![0].toBase58()
      const v = await httpGet("/project?address=" + tokenAddress);
      if (v.code === 0) {
        const data = v.data[0];
        showShare(mapDataToProject(data), true, () => {
          router.push("/detail?address=" + tokenAddress);
        })
      }
    }
  }, [props]);

  return (
    <>
      {isMobile ? (
        <Mobile {...props} setShowSuccessModal={share} />
      ) : (
        <Laptop {...props} setShowSuccessModal={share} />
      )}
    </>
  );
});

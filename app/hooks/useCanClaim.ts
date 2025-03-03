import React, { useEffect, useState } from 'react'
import { useAccount } from "@/app/hooks/useAccount";
import CopyTrade from "@/app/services/copyTrade";
import Big from "big.js";

export default function useCanClaim({pathname}: {pathname: string}) {
  const { address: sexAddress } = useAccount();
  const copyTradeService = new CopyTrade();
  const [copyTradeUserInfo, setCopyTradeUserInfo] = useState<any>(null);
  let canClaim =
  new Big(copyTradeUserInfo?.carryFee || "0").minus(
    new Big(copyTradeUserInfo?.claimed || "0")
  ).toNumber();
  useEffect(() => {
    if (sexAddress) {
      copyTradeService
        .getCopyTradersUserInfo({ address: sexAddress, chain: "solana" })
        .then((res) => {
          setCopyTradeUserInfo(res.data);
        });
    }
  }, [sexAddress,pathname]);
  
  return canClaim;
}

"use client";

import React from "react";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import Info from "../info";
import { useAuth } from "@/app/context/auth";

export default function ConnectButton({ logout }: any) {
  const { userInfo } = useAuth();
  return (
    <div>
      {userInfo?.address ? (
        <Info logout={logout} />
      ) : (
        <WalletModalButton
          style={{
            background: "transparent",
            borderRadius: 48,
            border: "1px solid #FBCA04",
            color: "#FBCA04",
            height: 36,
            fontSize: 14
          }}
        >
          Connect Wallet
        </WalletModalButton>
      )}
    </div>
  );
}

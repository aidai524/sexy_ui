"use client";

import React from "react";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import Info from "../info";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectButton({ logout }: any) {
  const { connected } = useWallet();

  return (
    <div>
      {connected ? (
        <Info logout={logout} />
      ) : (
        <WalletModalButton
          style={{
            background: "transparent",
            borderRadius: 48,
            border: "2px solid #AF0",
            color: "#AAFF00",
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

"use client";

import React from "react";
import styles from "./index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectButton({ userInfo }: any) {
  const { connected, publicKey, disconnect } = useWallet();

  return (
    <div>
      {connected ? (
        <div className={styles.Button} onClick={disconnect}>
          {userInfo?.icon && (
            <img src={userInfo.icon} className={styles.Avatar} />
          )}
          <div className={styles.Name}>{userInfo?.name || "Dis"}</div>
        </div>
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

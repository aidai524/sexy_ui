"use client";

import React, { useMemo } from "react";
import styles from "./connectButton.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useWallet } from "@solana/wallet-adapter-react";
import { formatSortAddress } from "@/app/utils";

export default function ConnectButton() {
  const { connected, publicKey, disconnect } = useWallet();
  const accountId = useMemo(() => publicKey?.toBase58(), [publicKey]);

  return (
    <div>
      {connected ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 14, color: "#fff" }}>
            {formatSortAddress(accountId)}
          </div>
          <div className={styles.button} onClick={disconnect}>
            Disconnect
          </div>
        </div>
      ) : (
        <WalletModalButton
          style={{
            background: "#FFFFFF1F",
            borderRadius: 24,
            padding: "0 10px"
          }}
        >
          Connect
        </WalletModalButton>
      )}
    </div>
  );
}

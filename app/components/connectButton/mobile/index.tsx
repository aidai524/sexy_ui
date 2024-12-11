"use client";

import React from "react";
import styles from "./index.module.css";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function ConnectButton() {
  const { connected, publicKey, disconnect, wallets } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    const walletsToCheck = [
      // @ts-ignore
      { name: 'Phantom', globalObject: window?.phantom }
    ];
    walletsToCheck.forEach(({ name }) => {
      window?.localStorage?.removeItem?.('walletName');
      const wallet = wallets.find((wallet) => wallet.adapter.name === name);
      if (wallet) {
        wallet.adapter.disconnect();
      }
    });
    setVisible(true);
  };

  return (
    <div>
      {
        connected ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={styles.button} onClick={disconnect}>
              Dis
            </div>
          </div>
        ) : (
          <div className={styles.button} onClick={handleConnect}>
            Connect
          </div>
        )
      }
    </div>
  );
}

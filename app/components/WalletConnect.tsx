"use client";

import React, { useMemo } from "react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@/app/libs/solana/wallet-adapter/modal";
import { clusterApiUrl } from "@solana/web3.js";
import { OkxWalletAdapter } from "@/app/libs/solana/wallet-adapter/okx";
import { OkxWalletUIAdapter } from "@/app/libs/solana/wallet-adapter/okx/ui";
import {
  WalletConnectWalletAdapter,
  WalletConnectWalletAdapterConfig
} from "@/app/libs/solana/wallet-adapter/walletconnect";
import "@/app/libs/solana/wallet-adapter/modal/index.css";
import { getDeviceType } from "../utils";

const WALLET_CONNECT_METADATA = {
  name: "FlipN",
  description: "FlipN",
  url: "https://app.flipn.fun",
  icons: ["https://app.flipn.fun/favicon.ico"]
};

const WALLET_CONNECT_OPTIONS: WalletConnectWalletAdapterConfig["options"] = {
  projectId: "3df9d49016708f3be47fcba48de15b86",
  metadata: WALLET_CONNECT_METADATA,
  features: {
    analytics: false,
    email: false,
    socials: false,
    emailShowWallets: false
  }
};

function getEndpoint(netType: WalletAdapterNetwork) {
  if (netType === WalletAdapterNetwork.Mainnet) {
    return "https://swr.xnftdata.com/rpc-proxy/";
  }

  return clusterApiUrl(netType);
}

export default function WalletConnect({
  children
}: {
  children: React.ReactNode;
}) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => getEndpoint(network), [network]);
  const wallets = useMemo(
    () => {
      if (typeof window === "undefined") return [];
      return getDeviceType().mobile
        ? [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new OkxWalletUIAdapter(),
            new WalletConnectWalletAdapter({
              network,
              options: WALLET_CONNECT_OPTIONS
            })
          ]
        : [
            new OkxWalletAdapter(),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new WalletConnectWalletAdapter({
              network,
              options: WALLET_CONNECT_OPTIONS
            })
          ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );
  const sortedWallets = ["WalletConnect", "Backpack", "Phantom", "OKX Wallet"];
  const disabledWallets = ["MetaMask"];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect={true} wallets={wallets}>
        <WalletModalProvider
          sortedWallets={sortedWallets}
          disabledWallets={disabledWallets}
        >
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

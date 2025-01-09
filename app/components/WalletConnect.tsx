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
  projectId: "669d1b9f59163a92d90a3c1ff78a7326",
  metadata: WALLET_CONNECT_METADATA,
  features: {
    analytics: false,
    email: false,
    socials: false,
    emailShowWallets: false
  }
};

// @ts-ignore
const netType = WalletAdapterNetwork[process.env.NEXT_PUBLIC_NET || 'Devnet']

function getEndpoint(netType: WalletAdapterNetwork) {
  if (netType === WalletAdapterNetwork.Mainnet) {
    return 'https://swr.xnftdata.com/rpc-proxy/'
    // return process.env.NEXT_PUBLIC_ENDPOINT || "https://solana-mainnet.core.chainstack.com/26539386617197b730ed9e3c81b611df"
    // return "https://pump-fe.helius-rpc.com/?api-key=1b8db865-a5a1-4535-9aec-01061440523b";
  }

  return clusterApiUrl(netType);
}

export default function WalletConnect({
  children
}: {
  children: React.ReactNode;
}) {
  const network = netType;
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
    <ConnectionProvider endpoint={endpoint} >
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

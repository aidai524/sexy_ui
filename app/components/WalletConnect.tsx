'use client'

import React, { useMemo } from 'react';
import { createAppKit, useAppKitProvider, useWalletInfo } from '@reown/appkit/react'
import { SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter,  } from '@solana/wallet-adapter-wallets'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

// const solanaWeb3JsAdapter = new SolanaAdapter({
//   // @ts-ignore
//   wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
// })


// const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '0b2f56ac0fc402ed0e62c10d7e75f555'
// const metadata = {
//   name: 'Dating App',
//   description: 'A Solana-based dating app',
//   url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
//   icons: ['https://picsum.photos/200/200']
// }

// const apKit = createAppKit({
//   adapters: [solanaWeb3JsAdapter],
//   networks: [solanaDevnet],
//   metadata: metadata,
//   projectId,
//   features: {
//     analytics: true
//   }
// });

// apKit.subscribeEvents((e) => {
//   console.log('>>>>> subscribeEvents', e.data);
//   if (e.data.event === "CONNECT_SUCCESS" && e.data.properties.name === 'Phantom' && /Mobi|Android/i.test(window?.navigator.userAgent)) {
//     window.location.href = `https://phantom.app/ul/v1/connect?redirect_link=${window.location.href}`;
//   }
// })

export default function WalletConnect({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        // @ts-ignore
        wallets={wallets}
        autoConnect
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 
'use client'

import React from 'react'
import { createAppKit, useAppKitProvider } from '@reown/appkit/react'
import { SolanaAdapter, useAppKitConnection, } from '@reown/appkit-adapter-solana/react'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

// 设置 Solana 适配器
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
})

// 项目配置
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID'
const metadata = {
  name: 'Dating App',
  description: 'A Solana-based dating app',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  icons: ['https://picsum.photos/200/200']
}

if (typeof window !== 'undefined') {
  // 初始化 AppKit
  createAppKit({
    adapters: [solanaWeb3JsAdapter],
    networks: [solanaDevnet],
    metadata: metadata,
    projectId,
    features: {
      analytics: true
    }
  })
}



// console.log(modal, solanaWeb3JsAdapter)

export default function WalletConnect({ children }: { children: React.ReactNode }) {
  // if (typeof window === 'undefined') {
  //   return null
  // }

  return <>
    {children}
  </>
} 
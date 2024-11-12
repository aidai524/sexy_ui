import type { Metadata } from 'next'
import './globals.css'
import Layout from './components/Layout'
import WalletConnect from './components/WalletConnect'

export const metadata: Metadata = {
  title: 'Dating App',
  description: 'A Solana-based dating app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <WalletConnect>
          <Layout>{children}</Layout>
        </WalletConnect>
      </body>
    </html>
  )
}
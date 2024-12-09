'use client'

import React from 'react'
import styles from './connectButton.module.css'
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ConnectButton() {
  const { connected, publicKey, disconnect } = useWallet();

  return (
    <div>
      {
        connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className={styles.button} onClick={disconnect}>
            Dis
            </div>
          </div>
        ) : (
          <WalletModalButton style={{ background: '#FFFFFF1F', borderRadius: 24, padding: '0 10px' }}>
            Connect
          </WalletModalButton>
        )
      }
    </div>
  )
} 
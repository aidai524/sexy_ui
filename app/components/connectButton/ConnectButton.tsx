'use client'
import React, { useState } from 'react'
import { Button } from 'antd-mobile'
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKit, useAppKitProvider, useAppKitState, useAppKitAccount, useDisconnect, UseAppKitNetworkReturn } from '@reown/appkit/react'
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import styles from './connectButton.module.css'

export default function ConnectButton() {
  const appKit = useAppKit()
  const { walletProvider } = useAppKitProvider<Provider>('solana')
  const account = useAppKitAccount()
  const { disconnect, } = useDisconnect()
  const { connection } = useAppKitConnection()

  // console.log('connection:', connection)

  const handleConnect = async () => {
    try {
      await appKit.open()
    } catch (error) {
      console.error('Wallet connection error:', error)
    } finally {
    }
  }

  const handleDisconnect = async () => {
    // disconnect()
    await appKit.open()
  }

  // console.log('account:', account)

  if (account && account.address) {
    return <div onClick={handleDisconnect}>
      <img src="/img/home/solana.png" className={styles.loginBtn} />
    </div>
  }

  return (
    <div>
      <div
        className={styles.button}
        onClick={handleConnect}
      >
        Connect
      </div>
    </div>
  )
} 
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
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function ConnectButton() {
  // const appKit = useAppKit()
  // const { walletProvider } = useAppKitProvider<Provider>('solana')
  // const account = useAppKitAccount()
  // const { disconnect, } = useDisconnect()
  // const { connection } = useAppKitConnection()
  const { connected, publicKey, disconnect } = useWallet();

  // console.log('connection:', connection)

  // const handleConnect = async () => {
  //   try {
  //     // await appKit.open()
  //   } catch (error) {
  //     console.error('Wallet connection error:', error)
  //   } finally {
  //   }
  // }
  //
  // const handleDisconnect = async () => {
  //   // disconnect()
  //   // await appKit.open()
  // }

  // console.log('account:', account)

  // if (account && account.address) {
  //   return <div onClick={handleDisconnect}>
  //     <img src="/img/home/solana.png" className={styles.loginBtn} />
  //   </div>
  // }

  return (
    <div>
      {
        connected ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/*<div className="">
              {publicKey?.toString?.()?.slice(0, 4) + '...' + publicKey?.toString?.()?.slice(39)}
            </div>*/}
            <div className={styles.button} onClick={disconnect}>
              Disconnect
            </div>
          </div>
        ) : (
          <WalletMultiButton style={{ background: '#FFFFFF1F', borderRadius: 24 }}>
            Connect
          </WalletMultiButton>
        )
      }
    </div>
  )
} 
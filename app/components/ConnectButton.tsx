'use client'
import React, { useState } from 'react'
import { Button } from 'antd-mobile'
import { useAppKit } from '@reown/appkit/react'
import styles from './connectButton.module.css'

export default function ConnectButton() {
  const appKit = useAppKit()
  const [isConnecting, setIsConnecting] = useState(false)
  const isConnected = Boolean(appKit.address)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      if (isConnected) {
        await appKit.close()
      } else {
        await appKit.open()
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      className={styles.button}
      color='primary'
      onClick={handleConnect}
      size='small'
      loading={isConnecting}
    >
      {isConnected ? `${appKit.address?.slice(0, 6)}...${appKit.address?.slice(-4)}` : '连接钱包'}
    </Button>
  )
} 
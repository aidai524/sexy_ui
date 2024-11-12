'use client'
import React, { useState } from 'react'
import { Button } from 'antd-mobile'
import { useAppKit } from '@reown/appkit/react'
import styles from './connectButton.module.css'

export default function ConnectButton() {
  const appKit = useAppKit()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await appKit.open()
    } catch (error) {
      console.error('Wallet connection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsConnecting(true)
      await appKit.close()
    } catch (error) {
      console.error('Wallet disconnection error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // 使用 localStorage 来检查连接状态
  const isConnected = typeof window !== 'undefined' && localStorage.getItem('walletconnect') !== null

  return (
    <Button
      className={styles.button}
      color='primary'
      onClick={isConnected ? handleDisconnect : handleConnect}
      size='small'
      loading={isConnecting}
    >
      {isConnected ? '断开连接' : '连接钱包'}
    </Button>
  )
} 
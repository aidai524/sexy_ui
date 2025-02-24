"use client";
import React from 'react'
import styles from './index.module.css'
import { useUserAgent } from '@/app/context/user-agent'
import TopTraderDetailM from '../topTraderDetailM'
import TopTraderDetailPC from '../topTraderDetailPC'
export default function TopTraderDetailContent() {
  const { isMobile } = useUserAgent();
  console.log('isMobile', isMobile)
  return (
    <>
    {
       isMobile ? (
        <TopTraderDetailM />
       ) : (
        <TopTraderDetailPC />
       )
    }
    </>
  )
}

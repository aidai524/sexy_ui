"use client";
import React from 'react'
import styles from './index.module.css'
import { useUserAgent } from '@/app/context/user-agent'
import TopTraderDetailM from '../topTraderDetailM'
export default function TopTraderDetailContent() {
  const { isMobile } = useUserAgent();
  return (
    <>
    {
       isMobile ? (
        <TopTraderDetailM />
       ) : null
    }
    </>
  )
}

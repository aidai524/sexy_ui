"use client";
import React from 'react'
import styles from './index.module.css'
import { useUserAgent } from '@/app/context/user-agent'
import SmartDetailM from '../smartDetailM'
export default function SmartDetailContainer() {
  const { isMobile } = useUserAgent();
  return (
    <>
    {
       isMobile ? (
        <SmartDetailM />
       ) : null
    }
    </>
  )
}

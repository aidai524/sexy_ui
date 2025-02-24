"use client";
import React from 'react'
import styles from './index.module.css'
import { useUserAgent } from '@/app/context/user-agent'
import SmartDetailM from '../smartDetailM'
import SmartDetailPC from '../smartDetailPC';
export default function SmartDetailContainer() {
  const { isMobile } = useUserAgent();
  return (
    <>
    {
       isMobile ? (
        <SmartDetailM />
       ) : (
        <SmartDetailPC />
       )
    }
    </>
  )
}

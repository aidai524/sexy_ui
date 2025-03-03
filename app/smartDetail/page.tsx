"use client";
import React from 'react'
import SmartDetailContainer from '@/app/sections/smart/components/smartDetailContainer'
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import { useRouter } from 'next/navigation';
export default function SmartDetail() {
  const router = useRouter();
  if (!SHOW_COPY_TRADE) {
    router.push("/");
    return null;
  }
  return (
    <SmartDetailContainer />
  )
}
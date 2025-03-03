'use client'
import React from 'react'
import TopTraderDetailContent from '@/app/sections/smart/components/topTraderDetailContent'
import { SHOW_COPY_TRADE } from '@/app/utils/config';
import { useRouter } from 'next/navigation';

export default function SmartTopDetail() {
  const router = useRouter();
  if (!SHOW_COPY_TRADE) {
    return router.push("/");
  }
  return (
   <TopTraderDetailContent />
  )
}

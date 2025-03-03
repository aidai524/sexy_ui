'use client'
import React from 'react'
import TopTraderDetailContent from '@/app/sections/smart/components/topTraderDetailContent'
import { SHOW_COPY_TRADE } from '@/app/utils/config';

export default function page() {
  if (!SHOW_COPY_TRADE) {
    return null
  }
  return (
   <TopTraderDetailContent />
  )
}

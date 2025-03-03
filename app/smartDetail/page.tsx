"use client";
import React from 'react'
import SmartDetailContainer from '@/app/sections/smart/components/smartDetailContainer'
import { SHOW_COPY_TRADE } from '@/app/utils/config';

export default function SmartDetail() {
  if (!SHOW_COPY_TRADE) {
    return null
  }
  return (
    <SmartDetailContainer />
  )
}
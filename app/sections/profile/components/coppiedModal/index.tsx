import React from 'react'
import { useUserAgent } from '@/app/context/user-agent'
import CoppiedAction from '../coppiedAction';
import CoppiedActionPc from '../coppiedActionPc';

export default function CoppiedModal({copiedInfo, show, onClose}: any) {
  const { isMobile } = useUserAgent();
  return (
    isMobile ? <CoppiedAction copiedInfo={copiedInfo} show={show} onClose={onClose} /> : <CoppiedActionPc copiedInfo={copiedInfo} show={show} onClose={onClose} />
  )
}

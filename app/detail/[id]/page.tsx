"use client"

import dynamic from 'next/dynamic'

const DetailCom = dynamic(() => import('@/app/sections/detail'), {
    ssr: false
  })

export default function Detail() {
    return <DetailCom />
}
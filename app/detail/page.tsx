"use client"

import dynamic from 'next/dynamic'


const HomeCom = dynamic(() => import('@/app/sections/detail'), {
    ssr: false
  })
  

export default function Detail() {
    return <HomeCom />
}
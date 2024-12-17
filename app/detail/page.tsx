"use client"

import dynamic from 'next/dynamic'


const HomeCom = dynamic(() => import('@/app/sections/detail'), {
    ssr: false
  })
  

export default function Detail() {
    return <div style={{ minHeight: '100vh', background: 'rgba(255, 38, 129, 1)' }}>
      <HomeCom />
    </div>
}
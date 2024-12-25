"use client"

import { Skeleton } from 'antd-mobile'
import dynamic from 'next/dynamic'



const HomeCom = dynamic(() => import('@/app/sections/detail'), {
    ssr: false,
    loading: () => (<>
      <Skeleton style={{ height: 100 }} animated />
      <Skeleton style={{ height: 300 }} animated />
      <Skeleton style={{ height: 100 }} animated />
      <Skeleton style={{ height: 100 }} animated />
    </>)
  })
  

export default function Detail() {
    return <div style={{ minHeight: '100vh', background: 'rgba(255, 38, 129, 1)' }}>
      <HomeCom />
    </div>
}
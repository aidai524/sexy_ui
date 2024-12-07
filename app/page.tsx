"use client"
import React from 'react'
import { Toast } from 'antd-mobile'
import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

const HomeCom = dynamic(() => import('./sections/home'), {
  ssr: false
})

export default function Home() {
  return <HomeCom />
} 
"use client"

import dynamic from 'next/dynamic'

const FollowerCom = dynamic(() => import("@/app/sections/profile/follower"), {
    ssr: false
})

export default function Follower() {
    return <FollowerCom />    
}
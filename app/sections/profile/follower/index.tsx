import Back from '@/app/components/back'
import styles from './follower.module.css'
import Tab from '../components/tab'
import FollowerList from './component/followerList'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { httpGet, httpAuthGet, formatAddress } from '@/app/utils'
import useUserInfo from '../hooks/useUserInfo'
import useFollow from '../hooks/useFollow'

export default function Follower() {
    const params = useSearchParams()
    const { userInfo } = useUserInfo(params.get('account')?.toString())
    const { followerList, followingList } = useFollow(params.get('account')?.toString())

    return <div className={ styles.main }>
        <div className={ styles.header }>
            <Back/>
            <div>{ userInfo && (userInfo?.name || formatAddress(userInfo?.address as string)) }</div>
        </div>

        <Tab nodes={[
            {
                name: followerList.length + ' Followers',
                content: <FollowerList list={followerList} followerType={1}/>
            },
            {
                name: followingList.length + ' Following',
                content: <FollowerList list={followingList} followerType={2}/>
            }
        ]}/>
    </div>
}
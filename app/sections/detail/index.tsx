"use client"
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import Info from './components/info/detail'
import Chart from './components/chart/index'
import Trade from './components/trade/index'
import Txs from './components/txs/index'

import { AvatarBack } from '@/app/components/thumbnail'

import styles from './detail.module.css'
import { useEffect, useState } from 'react'
import Tab from '@/app/components/tab'
import type { Project } from '@/app/type'
import { useVip } from '@/app/hooks/useVip'
import { useRouter, useSearchParams } from 'next/navigation'
import { httpGet, mapDataToProject } from '@/app/utils'


export default function Detail() {
    const params = useSearchParams()
    const [activeKey, setActiveKey] = useState('Info')
    const [infoData, setInfoData] = useState<Project>()

    useEffect(() => {
        const id = params.get('id')
        if (id) {
            httpGet('/project', { id }).then(res => {
                if (res.code === 0 && res.data) {
                    const infoData = mapDataToProject(res.data)
                    setInfoData(infoData)
                }
            })
        }
    }, [params])

    if (!infoData) {
        return <></>
    }

    return <div className={styles.main}>
        <AvatarBack data={infoData} />
        <Tab activeNode={activeKey} onTabChange={(nodeName) => {
            setActiveKey(nodeName)
        }} nodes={[{
            name: 'Info',
            content: <Info data={infoData} />
        }, {
            name: 'Chart',
            content: <Chart />
        }, {
            name: 'Buy/Sell',
            content: <Trade />
        }, {
            name: 'Txs',
            content: <Txs />
        }]} />
    </div>
}




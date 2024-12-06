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
import { useRouter, useParams } from 'next/navigation'
import { httpGet, mapDataToProject } from '@/app/utils'


const TabIcon = <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="4" cy="5.17177" rx="4" ry="4.43019" fill="#FF2681" />
</svg>

export default function Detail() {
    const { call } = useVip()

    const params = useParams()


    const [showTabs, setShowTabs] = useState(true)
    const [activeKey, setActiveKey] = useState('Info')

    const [infoData, setInfoData] = useState<Project>()

    useEffect(() => {
        if (params.id) {
            httpGet('/project', { id: params.id }).then(res => {
                console.log(res)
                if (res.code === 0 && res.data) {
                    const infoData = mapDataToProject(res.data)
                    setInfoData(infoData)
                }
            })
        }
    }, [params])

    if (!infoData) {
        return 
    }

    return <div className={styles.main}>
        <AvatarBack data={infoData} />

        {/* <Button onClick={() => {
            call('super-like')
        }}> super like </Button>

        <Button onClick={() => {
            call('boost')
        }}> boost </Button>

        <Button onClick={() => {
            call('vip')
        }}> vip </Button>

        <Button onClick={() => {
            buyToken()
        }}>Buy</Button>

        <Button onClick={() => {
            sellToken(34)
        }}>Sell</Button>

        <Button onClick={() => {
            createToken()
        }}>Create</Button> */}

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




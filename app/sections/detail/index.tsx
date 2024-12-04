import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import Info from './components/info/detail'
import Chart from './components/chart/index'
import Trade from './components/trade/index'
import Txs from './components/txs/index'

import { AvatarBack } from '@/app/components/thumbnail'

import styles from './detail.module.css'
import { useState } from 'react'
import Tab from '@/app/components/tab'
import type { Project } from '@/app/type'
import { useVip } from '@/app/hooks/useVip'
import { Button } from 'antd-mobile'

const TabIcon = <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="4" cy="5.17177" rx="4" ry="4.43019" fill="#FF2681" />
</svg>

export default function Detail() {
    const { call } = useVip()

    const [showTabs, setShowTabs] = useState(true)
    const [activeKey, setActiveKey] = useState('Info')

    const [infoData, setInfoData] = useState<Project>({
        tokenName: '2332',
        ticker: '43433',
        about: 'hello aaa',
        website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
        tokenImg: 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect',
    })

    

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




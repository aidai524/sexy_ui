


import { Button, TabBar } from 'antd-mobile'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import Info from './components/info/detail'
import Chart from './components/chart/index'
import Trade from './components/trade/index'
import Txs from './components/txs/index'

import Thumbnail, { AvatarBack } from '@/app/components/thumbnail'

import styles from './detail.module.css'
import { useState } from 'react'
import Tab from '@/app/components/tab'

const TabIcon = <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="4" cy="5.17177" rx="4" ry="4.43019" fill="#FF2681" />
</svg>

export default function Detail() {
    const { buyToken, sellToken } = useTokenTrade({
        tokenName: 'Zero',
        tokenSymbol: 'ZERO'
    })

    const [showTabs, setShowTabs] = useState(true)
    const [activeKey, setActiveKey] = useState('Buy/Sell')

    return <div className={styles.main}>
        <AvatarBack />
        {/* <Button onClick={() => {
            buyToken()
        }}>Buy</Button>

        <Button onClick={() => {
            sellToken()
        }}>Sell</Button> */}

        

        <Tab activeNode={ activeKey } onTabChange={(nodeName) => {
            setActiveKey(nodeName)
        }} nodes={[{
            name: 'Info',
            content: <Info />
        }, {
            name: 'Chart',
            content: <Chart />
        }, {
            name: 'Buy/Sell',
            content: <Trade />
        }, {
            name: 'Txs',
            content: <Txs />
        }]}/>
    </div>
}


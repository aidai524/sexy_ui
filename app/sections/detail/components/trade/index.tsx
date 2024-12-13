import { useState } from 'react'
import CA from '../ca'

import Trade from '@/app/components/trade'
import Holder from '@/app/components/holder'
import type { Project } from '@/app/type'

interface Props {
    data: Project
}

export default function TradeInfo({
    data
}: Props) {
    return <div className={ '' }>
        <CA />
        <Trade token={{
            tokenName: data.tokenName,
            tokenSymbol: data.tokenSymbol as string,
            tokenUri: data.tokenIcon || data.tokenImg,
            tokenDecimals: 2
        }}/>
        <Holder />
    </div>
}
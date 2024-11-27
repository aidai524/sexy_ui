import Thumbnail, { AvatarBack } from '@/app/components/thumbnail'
import Comment from '@/app/components/comment'
import Panel from '../../../../components/panel'


import styles from './detail.module.css'
import Action from '@/app/components/action'
import { Button } from 'antd-mobile'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import InfoPart from './infoPart'
import { useState } from 'react'
import type { Project } from '@/app/type'

interface Props {
    data: Project
}

export default function Info({
    data
}: Props) {
    const { buyToken, sellToken } = useTokenTrade({
        tokenName: 'Zero',
        tokenSymbol: 'ZERO'
    })

    // const [infoData, setInfoData] = useState<Project>({
    //     tokenName: '2332',
    //     ticker: '43433',
    //     about: 'hello aaa',
    //     website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
    //     tokenImg: 'https://chinese.freecodecamp.org/news/content/images/size/w2000/2022/09/pawel-czerwinski-dYjFmiQb_aE-unsplash.jpeg',
    // })

    return <div className={styles.main}>

        {/* <Button onClick={() => {
            buyToken()
        }}>Buy</Button>

        <Button onClick={() => {
            sellToken()
        }}>Sell</Button> */}
      
        {/* <AvatarBack /> */}
        
        <InfoPart data={data} showThumbnailHead={false} />
        <Comment />

        <div className={styles.action}>
            <Action style={{ position: 'static' }}/>
        </div>

    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
import { useState } from 'react'
import styles from './trande.module.css'
import MainBtn from '@/app/components/mainBtn'
import { Avatar } from '../../thumbnail'
import type { Project } from '@/app/type'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'

export default function Trade() {
    const [infoData, setInfoData] = useState<Project>({
        tokenName: '2332',
        ticker: '43433',
        about: 'hello aaa',
        website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
        tokenImg: 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect',
    })

    const { prePaid } = useTokenTrade({
        tokenName: 'HeHe',
        tokenSymbol: 'HEHE',
    })
    
    return <div className={ styles.main }>
        <div className={ styles.avatar }>
            <Avatar data={infoData}/>
        </div>

        <div className={ [styles.cationArea, styles.panel].join(' ' ) }>
            <div className={ styles.inputArea }>
                <div className={ styles.actionArea }>
                    <div className={ styles.switchToken }>
                        <span className={ styles.switchTitle }>Pre Buy</span>
                    </div>
                    <div className={ styles.slippage }>Maximum 0.05 SOL</div>
                </div>

                <div className={ styles.inputArea }>
                    <input className={ styles.input } />
                    <div className={ styles.inputToken }>
                        <div className={ styles.tokenName }>SOL</div>
                        <div className={ styles.tokenImg }>
                            <img className={ styles.tiImg } src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                        </div>
                    </div>
                </div>

                <div className={ styles.tokenPercent }>
                    <div className={ styles.percentTag }>Reset</div>
                    <div className={ [styles.percentTag, styles.tagActive].join(' ') }>0.1SOL</div>
                    <div className={ styles.percentTag }>0.5SOL</div>
                    <div className={ styles.percentTag }>1SOL</div>
                </div>
            </div>

            <div style={{ marginTop: 30 }} className={ styles.receiveTokenAmount }>
                <div className={ styles.receiveTitle }>You will auto-buy in when this meme launched.
                You can withdraw anytime before launching.</div>
            </div>
            <div style={{ marginTop: 18 }}>
                <MainBtn onClick={() => {
                    prePaid(1)
                }} style={{ backgroundColor: '#9514FF'  }}>Pre-Buy</MainBtn>
            </div>
        </div>

    </div>
}
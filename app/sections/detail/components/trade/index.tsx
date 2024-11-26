import { useState } from 'react'
import styles from './trande.module.css'
import MainBtn from '@/app/components/mainBtn'
import CA from '../ca'

export default function Trade() {
    const [activeIndex, setActiveIndex] = useState(0)

    return <div className={ styles.main }>
        <CA />

        <div className={ [styles.cationArea, styles.panel].join(' ' ) }>
            <div className={ styles.tradeTabs }>
                <div onClick={() => { setActiveIndex(0) }} className={ [styles.tab, activeIndex === 0 ? styles.active : null].join(' ') }>Buy</div>
                <div onClick={() => { setActiveIndex(1) }} className={ [styles.tab, activeIndex === 1 ? styles.active : null].join(' ')  }>Sell</div>
            </div>

            <div className={ styles.inputArea }>
                <div className={ styles.actionArea }>
                    <div className={ styles.switchToken }>
                        <span className={ styles.switchTitle }>switch to </span>
                        <span className={ styles.switchTokenName }>VVA</span>
                    </div>
                    <div className={ styles.slippage }>Set max slippage</div>
                </div>

                <div className={ styles.inputArea }>
                    <input className={ styles.input } />
                    <div className={ styles.inputToken }>
                        <div className={ styles.tokenName }>VVA</div>
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
                <div className={ styles.receiveTitle }>You will buy in</div>
                <div className={ styles.receiveAmount }>162,645,646.35 VVA</div>
            </div>
            <div style={{ marginTop: 18 }}>
                <MainBtn>Place Trade</MainBtn>
            </div>
        </div>

        <div className={ styles.distributionArea }>
            <div className={ styles.distributionTitle }>Holder Distribution</div>
            <div className={ styles.list }>
                <div className={ styles.item }>
                    <div className={ styles.itemContent }>
                        <div style={{ width: 20 }}>1.</div>
                        <div>Bro098detum</div>
                    </div>
                    
                    <div className={ styles.itemPercent }>89.2%</div>
                </div>

                <div className={ styles.item }>
                    <div className={ styles.itemContent }>
                        <div style={{ width: 20 }}>2.</div>
                        <div>Bro098detum</div>
                    </div>
                    
                    <div className={ styles.itemPercent }>89.2%</div>
                </div>
            </div>
        </div>
    </div>
}
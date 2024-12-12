import { useState } from 'react'
import styles from './trande.module.css'
import CA from '../ca'
import BuySell from './buySell'

const token: any = {
    tokenName: 'MoMo',
    tokenSymbol: 'MOMO',
    tokenUri: 'https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect',
    tokenDecimals: 2,
}

export default function Trade() {
    const [showSlip, setShowSlip] = useState(false)

    return <div className={ styles.main }>
        <CA />

        <BuySell token={token} />

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
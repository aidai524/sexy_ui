import { useState } from 'react'
import styles from './trande.module.css'
import MainBtn from '@/app/components/mainBtn'
import { Avatar } from '../../thumbnail'
import type { Project } from '@/app/type'
import Big from 'big.js'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'
import { fail, success } from '@/app/utils/toast'

interface Props {
    token: Project;
}

export default function Trade({ token }: Props) {
    const [inputVal, setInputVal] = useState('')
    const [quickIndex, setQuickIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const [infoData, setInfoData] = useState<Project>({
        tokenName: '2332',
        ticker: '43433',
        about: 'hello aaa',
        website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
        tokenImg: 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect',
    })

    const { prePaid } = useTokenTrade({
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol || token.tokenName.toUpperCase(),
        loadData: false
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
                    <input value={inputVal} onChange={(e) => {
                        setInputVal(e.target.value)
                    }} className={ styles.input } />
                    <div className={ styles.inputToken }>
                        <div className={ styles.tokenName }>SOL</div>
                        <div className={ styles.tokenImg }>
                            <img className={ styles.tiImg } src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                        </div>
                    </div>
                </div>

                <div className={ styles.tokenPercent }>
                    <div onClick={() => { setQuickIndex(0) }} className={ styles.percentTag }>Reset</div>
                    <div onClick={() => { 
                        setQuickIndex(1)
                        setInputVal('0.00000001')
                    }} className={ [styles.percentTag, quickIndex === 1 ? styles.tagActive : ''].join(' ') }>0.0000001SOL</div>
                    <div onClick={() => { 
                        setQuickIndex(2) 
                        setInputVal('0.00000005')
                    }} className={ [styles.percentTag, quickIndex === 2 ? styles.tagActive : ''].join(' ') }>0.0000005SOL</div>
                    {/* <div className={ [styles.percentTag, quickIndex === 3 ? styles.tagActive : ''].join(' ')}>1SOL</div> */}
                </div>
            </div>

            <div style={{ marginTop: 30 }} className={ styles.receiveTokenAmount }>
                <div className={ styles.receiveTitle }>You will auto-buy in when this meme launched.
                You can withdraw anytime before launching.</div>
            </div>
            <div style={{ marginTop: 18 }}>
                <MainBtn isLoading={isLoading} onClick={async () => {
                    try {
                        if (inputVal) {
                            setIsLoading(true)
                            const inputNum = new Big(inputVal).mul(10 ** 9).toFixed(0)
                            await prePaid(inputNum, token.tokenName, token.tokenSymbol || token.tokenName.toUpperCase())
                            setIsLoading(false)
                            success('Smoke like success')
                        }
                    } catch(e) {
                        console.log(e)
                        // fail(e.message)
                        setIsLoading(false)
                    }
                }} style={{ backgroundColor: '#9514FF'  }}>Pre-Buy</MainBtn>
            </div>
        </div>

    </div>
}
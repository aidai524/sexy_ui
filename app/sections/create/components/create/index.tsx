import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'ahooks'
import Big from 'big.js'
import styles from './trande.module.css'
import MainBtn from '@/app/components/mainBtn'
import { useTokenTrade } from '@/app/hooks/useTokenTrade';
import { getFullNum, httpGet } from '@/app/utils';
import { fail, success } from '@/app/utils/toast';
import { Popup } from 'antd-mobile'
import { Avatar } from '@/app/components/thumbnail'
import type { Project } from '@/app/type'
import CreateSuccessModal from '../createSuccessModal'
import { useRouter } from 'next/navigation'

type Token = {
    tokenName: string;
    tokenSymbol: string;
    tokenUri: string;
    tokenDecimals: number;
}

interface Props {
    token: Token,
    data: Project,
    show: boolean;
    onHide: () => void;
    onCreateTokenSuccess: () => void;
}

const SOL: Token = {
    tokenName: 'SOL',
    tokenSymbol: 'SOL',
    tokenUri: '/img/home/solana.png',
    tokenDecimals: 9,
}

const SOL_PERCENT_LIST = [0.00000001, 0.00000005]

export default function Create({
    token,
    data,
    show,
    onHide,
    onCreateTokenSuccess
}: Props) {
    const router = useRouter()

    const {
        tokenName,
        tokenSymbol,
        tokenUri,
    } = token

    const desToken: Token = {
        tokenName,
        tokenSymbol,
        tokenUri,
        tokenDecimals: 2,
    }

    const [infoData, setInfoData] = useState<Project>({
        tokenName: tokenName,
        ticker: data.ticker,
        about: '',
        website: '',
        tokenImg: tokenUri,
        tokenIcon: data.tokenIcon,
    })

    const [tokenType, setTokenType] = useState<number>(1)
    const [currentToken, setCurrentToken] = useState<Token>(SOL)
    const [errorMsg, setErrorMsg] = useState('')
    const [isError, setIsError] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [solPercent, setSolPercent] = useState(0)
    const [valInput, setValInput] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const { createToken } = useTokenTrade({
        tokenName,
        tokenSymbol,
        loadData: false
    })

    const debounceVal = useDebounce(valInput, { wait: 800 })

    useEffect(() => {
        // if (debounceVal) {
        //     if (activeIndex === 0) {
        //         let buyInSol = ''
        //         if (tokenType === 1) {
        //             buyInSol = new Big(debounceVal).mul(10 ** SOL.tokenDecimals).toFixed(0)
        //             const buyIn = new Big(debounceVal).mul(rate).toFixed(2)
        //             setBuyIn(buyIn)
        //         } else if (tokenType === 0) {
        //             buyInSol = new Big(debounceVal).div(new Big(rate)).mul(10 ** SOL.tokenDecimals).toFixed(0)
        //             if (Number(buyInSol) > 1) {
        //                 setBuyIn(debounceVal)
        //             } else {
        //                 setBuyIn('')
        //                 buyInSol = ''
        //             }
        //         }
        //         if (buyInSol) {
        //             setIsError(false)
        //             setErrorMsg('Enter a amount');
        //         }
        //         setBuyInSol(buyInSol)
        //     } else if (activeIndex === 1) {
        //         let sellOut = ''
        //         if (tokenType === 1) {
        //             sellOut = new Big(debounceVal).mul(rate).mul(10 ** token.tokenDecimals).toFixed(0)
        //         } else if (tokenType === 0) {
        //             sellOut = new Big(debounceVal).mul(10 ** token.tokenDecimals).toFixed(0)
        //         }

        //         console.log('sellOut:', sellOut)

        //         setSellOut(sellOut)
        //         if (sellOut) {
        //             setIsError(false)
        //             setErrorMsg('Enter a amount');
        //         }
        //     }
        // } else {
        //     setBuyIn('')
        //     setBuyInSol('')
        //     setSellOut('')
        //     setIsError(true)
        //     setErrorMsg('Enter a amount');
        // }
    }, [debounceVal, tokenType, currentToken])

    return <div>
        <Popup
            visible={show}
            onMaskClick={() => {
                onHide && onHide()
            }}
            onClose={() => {
                onHide && onHide()
            }}
            bodyStyle={{
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                paddingTop: 30,
                paddingBottom: 30,
                // height: '50vh'
            }}
        >
            <div className={ styles.avatar }>
                <Avatar data={infoData}/>
            </div>

            <div className={[styles.cationArea, styles.panel].join(' ')}>
                <div className={styles.inputArea}>
                    <div className={styles.actionArea}>
                        <div className={styles.slippage}>Pre-Buy (optional)</div>

                        {/* <div className={styles.switchToken} onClick={() => {
                            if (tokenType === 0) {
                                setCurrentToken(SOL)
                                setTokenType(1)
                            } else {
                                setCurrentToken(desToken)
                                setTokenType(0)
                            }
                        }}>
                            <span className={styles.switchTitle}>switch to </span>
                            <span className={styles.switchTokenName}>{tokenType === 0 ? SOL.tokenName : tokenName}</span>
                        </div> */}

                    </div>

                    <div className={styles.inputArea}>
                        <input value={valInput} onChange={(e) => { 
                            setValInput(e.target.value)
                            setSolPercent(0)
                        }} className={styles.input} />
                        <div className={styles.inputToken}>
                            <div className={styles.tokenName}>{currentToken.tokenName}</div>
                            <div className={styles.tokenImg}>
                                <img className={styles.tiImg} src={currentToken.tokenUri} />
                            </div>
                        </div>
                    </div>

                    {tokenType === 1 ? <div className={styles.tokenPercent}>
                        <div onClick={() => {
                            setSolPercent(0);
                            setValInput('')
                        }} className={styles.percentTag}>Reset</div>
                        {
                            SOL_PERCENT_LIST.map((item) => {
                                return <div
                                    onClick={() => {
                                        setSolPercent(item)
                                        setValInput(getFullNum(item))
                                    }}
                                    key={item} className={[styles.percentTag, item === solPercent ? styles.tagActive : ''].join(' ')}>
                                    {getFullNum(item)}SOL
                                </div>
                            })
                        }
                    </div> : null}
                </div>

                {/* <div style={{ marginTop: 10 }} className={styles.receiveTokenAmount}>
                    <div className={styles.receiveTitle}>You will buy in</div>
                    <div className={styles.receiveAmount}>{buyIn} {tokenName}</div>
                </div> */}

                <div style={{ marginTop: 20 }} className={styles.receiveTokenAmount}>
                    <div className={styles.receiveTitle} style={{ textAlign: 'center' }}>Its optional but buying a small amount of coins helps protect your coin from snipers</div>
                </div>
                <div style={{ marginTop: 18 }}>
                    <MainBtn
                        isLoading={isLoading}
                        isDisabled={isError}
                        onClick={async () => {
                            try {
                                if (isLoading || isError) {
                                    return
                                }

                                setIsLoading(true)

                                await createToken({
                                    name: tokenName,
                                    symbol: tokenSymbol,
                                    uri: tokenUri,
                                    amount: valInput ? new Big(valInput).mul(10 ** 9).toString() : ''
                                })
                                
                                await onCreateTokenSuccess()
                                onHide()
                                setShowSuccessModal(true)
                                setIsLoading(false)
                                // success('Transtion success')
                            } catch (e) {
                                console.log(e)
                                setIsLoading(false)
                                // fail('Transtion fail')
                            }
                        }}
                        style={{ background: 'rgba(255, 47, 116, 1)' }}>Create Coin</MainBtn>
                </div>
            </div>
        </Popup>

        <CreateSuccessModal token={data} show={showSuccessModal} onHide={async () => {
            const v = await httpGet('/project?token_name=' + token.tokenName)
            if (v.code === 0) {
                setShowSuccessModal(false)
                router.push('/detail?id=' + v.data.id)
            }
            
        }}/>
    </div>
}
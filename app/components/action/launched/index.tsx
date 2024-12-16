import Trade from '@/app/components/trade';
import styles from '../action.module.css'
import { Popup } from 'antd-mobile';
import { useState } from 'react';
import type { Project } from '@/app/type';
import { useAccount } from '@/app/hooks/useAccount';

interface Props {
    data: Project;
    justPlus?: boolean;
}

export default function Action({
    data, justPlus = false
}: Props) {
    const [tradeShow, setTradeShow] = useState(false)
    const [initType, setInitType] = useState('buy')
    const { address } = useAccount()

    const usedStyle = justPlus ? styles.justPlus : styles.action + ' ' + styles.launched

    return <div className={usedStyle}>
        {
            justPlus
                ? <>
                    <div onClick={() => {
                        if (!address) {
                            //@ts-ignore
                            window.connect()
                            return
                        }
                        setTradeShow(true)
                        setInitType('buy')
                    }}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.4" cx="18" cy="18" r="18" fill="black" />
                            <path d="M26.2844 24.9314C30.6051 20.6107 31.2419 14.2424 27.7068 10.7073L24.1508 7.15128L9.57113 23.8646L12.0603 26.3538C15.5954 29.8889 21.9638 29.2521 26.2844 24.9314Z" fill="#577123" />
                            <ellipse cx="16.6833" cy="15.3297" rx="9.55505" ry="11.0637" transform="rotate(-135 16.6833 15.3297)" fill="#C9FF5D" />
                            <path d="M21.283 15.1526L11.7279 15.1526" stroke="#577123" stroke-width="2" stroke-linecap="round" />
                            <path d="M16.5054 19.9297L16.5054 10.3746" stroke="#577123" stroke-width="2" stroke-linecap="round" />
                        </svg>


                    </div>
                </>
                : <>
                    <div className={styles.actionBtn} onClick={() => {
                        if (!address) {
                            //@ts-ignore
                            window.connect()
                            return
                        }

                        setTradeShow(true)
                        setInitType('buy')
                    }}>
                        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.05 29.0506C34.2407 23.8599 35.0058 16.2091 30.7588 11.9622L26.4867 7.69007L8.97111 27.769L11.9616 30.7594C16.2085 35.0064 23.8593 34.2413 29.05 29.0506Z" fill="#577123" />
                            <ellipse cx="17.5155" cy="17.5161" rx="11.4792" ry="13.2917" transform="rotate(-135 17.5155 17.5161)" fill="#C9FF5D" />
                            <path d="M23.0413 17.3022L11.5621 17.3022" stroke="#577123" stroke-width="2" stroke-linecap="round" />
                            <path d="M17.3018 23.042L17.3018 11.5628" stroke="#577123" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <div>Buy</div>
                    </div>

                    <div className={styles.actionBtn} onClick={() => {
                        if (!address) {
                            //@ts-ignore
                            window.connect()
                            return
                        }
                        
                        setTradeShow(true)
                        setInitType('sell')
                    }}>
                        <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M29.0502 29.0506C34.241 23.8599 35.006 16.2091 30.7591 11.9622L26.487 7.69007L8.97135 27.769L11.9618 30.7594C16.2088 35.0064 23.8595 34.2413 29.0502 29.0506Z" fill="#FF2681" />
                            <ellipse cx="17.5155" cy="17.5161" rx="11.4792" ry="13.2917" transform="rotate(-135 17.5155 17.5161)" fill="#FFC9F1" />
                            <path d="M23.0415 17.3022L11.5623 17.3022" stroke="#FF2681" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <div>Sell</div>
                    </div>
                </>
        }


        <Popup
            visible={tradeShow}
            onMaskClick={() => {
                setTradeShow(false)
            }}
            onClose={() => {
                setTradeShow(false)
            }}
            bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                paddingTop: 10,
                paddingBottom: 10
            }}
        >
            <div className={styles.main}>
                <Trade initType={initType} token={{
                    tokenName: data.tokenName,
                    tokenSymbol: data.tokenSymbol as string,
                    tokenUri: data.tokenIcon || data.tokenImg,
                    tokenDecimals: 2
                }} />
            </div>
        </Popup>
    </div>
}
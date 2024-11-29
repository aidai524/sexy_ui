import ConnectButton from '@/app/components/connectButton/ConnectButton'
import styles from './home.module.css'
import Thumbnail from '@/app/components/thumbnail'
import Tags from '../../components/tags'
import Action from '../../components/action'
import { useEffect, useState } from 'react'
import { httpGet } from '@/app/utils'
import { useAppKitAccount } from '@reown/appkit/react'
import type { Project } from '@/app/type'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [infoData, setInfoData] = useState<Project>({
        tokenName: '2332',
        ticker: '43433',
        about: 'hello aaa',
        website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
        tokenImg: 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect',
    })

    const [infoData2, setInfoData2] = useState<Project>({
        tokenName: '233112',
        ticker: '434323',
        about: 'hell22o aaa',
        website: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_backgrounds_and_borders/Using_multiple_backgrounds',
        tokenImg: 'https://pump.mypinata.cloud/ipfs/QmS3C8tTmeUu3qnJW1vzDXaCqaZsxLAfsieDms7hfyVvjB?img-width=800&img-dpr=2&img-onerror=redirect',
    })

    const router = useRouter()
    const [launchIndex, setLaunchIndex] = useState(0)
    const [list, setList] = useState([1, 2, 3, 4])
    const [actionStyle, setActionStyle] = useState<any>('')

    return <div className={styles.main}>
        <div className={styles.header}>
            <div onClick={() => { router.push('/') }}>
                <img src="/img/logo.svg" />
            </div>

            <div className={styles.launchPadTab}>
                <div onClick={() => { setLaunchIndex(0) }} className={[styles.launchPadTabTitle, launchIndex === 0 ? styles.launchPadTabTitleActive : ''].join(' ')}>Pre-Launch</div>
                <div onClick={() => { setLaunchIndex(1) }} className={[styles.launchPadTabTitle, launchIndex === 1 ? styles.launchPadTabTitleActive : ''].join(' ')}>Launching/ed</div>
            </div>

            <div className={styles.icons}>
                {/* <ConnectButton /> */}

                <div className={styles.notice}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="17" cy="17" r="17" fill="black" fill-opacity="0.2" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9722 6C14.0602 6 10.8889 9.17131 10.8889 13.0833V21.1111C10.8889 21.1111 10.8889 21.7014 10.4167 22.5278C10.0285 23.2071 9 23.9444 9 23.9444H26.9444C26.9444 23.9444 25.8777 23.2276 25.5278 22.5278C25.0556 21.5833 25.0556 21.1111 25.0556 21.1111V13.0833C25.0556 9.17131 21.8842 6 17.9722 6ZM17.9722 28.6667C19.7978 28.6667 21.2778 27.1867 21.2778 25.3611H14.6667C14.6667 27.1867 16.1466 28.6667 17.9722 28.6667Z" fill="url(#paint0_linear_17_841)" />
                        <circle cx="26.6667" cy="6.66667" r="4.66667" fill="#FF2BA0" stroke="white" stroke-width="2" />
                        <defs>
                            <linearGradient id="paint0_linear_17_841" x1="17.9722" y1="6" x2="17.9722" y2="28.6667" gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" stop-opacity="0.6" />
                                <stop offset="1" stop-color="white" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
        </div>

        <div className={styles.thumbnailListBox}>
            <div className={[styles.thumbnailBox].join(' ')}>
                <Thumbnail showDesc={true} data={infoData} />
            </div>
            <div className={[styles.thumbnailBox, actionStyle].join(' ')}>
                <Thumbnail showDesc={true} data={infoData2} />
            </div>
        </div>


        <Action onLike={() => {
            setActionStyle(styles.like)
        }} onHate={() => {
            setActionStyle(styles.hate)
        }} onSuperLike={() => {}} onBoost={() => {}}/>
    </div>
}
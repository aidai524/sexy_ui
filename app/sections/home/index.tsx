"use client"

import ConnectButton from '@/app/components/connectButton/ConnectButton'
import styles from './home.module.css'
import Thumbnail from '@/app/components/thumbnail'
import Action from '../../components/action'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import type { Project } from '@/app/type'
import { useRouter } from 'next/navigation'
import Hammer from 'hammerjs'
import { httpAuthGet, httpGet, httpAuthPost, mapDataToProject } from '@/app/utils'
import { useMessage } from '@/app/context/messageContext'

const defaulrImg = 'https://pump.mypinata.cloud/ipfs/QmYy8GNmqXVDFsSLjPipD5WGro81SmXpmG7ZCMZNHf6dnp?img-width=800&img-dpr=2&img-onerror=redirect'

export default function Home() {
    const [infoData, setInfoData] = useState<Project>()
    const [infoData2, setInfoData2] = useState<Project>()
    const router = useRouter()
    const [launchIndex, setLaunchIndex] = useState(0)
    const [actionStyle, setActionStyle] = useState<any>('')
    const listRef  = useRef<Project[]>()
    const { likeTrigger, setLikeTrigger } = useMessage()

    const containerRef = useRef<any>()

    function getnext() {
        if (listRef.current) {
            listRef.current.shift()
            renderTwoItems(listRef.current)
        }
    }

    function renderTwoItems(list: Project[]) {
        if (!list) {
            return
        }

        console.log('list:', list)

        if (list.length > 0) {
            const currentToken = list[0]
            setInfoData2(mapDataToProject(currentToken))
        }

        if (list.length > 1) {
            const currentToken = list[1]
            setInfoData(mapDataToProject(currentToken))
        }

        console.log(infoData, infoData2)
    }

    useEffect(() => {
        httpGet('/project/list?limit=50').then(res => {
            console.log('res:', res)
            if (res.code === 0 && res.data?.list) {
                listRef.current = (res.data?.list)
                console.log('res.data?.list:', res.data?.list)
                renderTwoItems(res.data?.list)
            }
        })
    }, [])

    useEffect(() => {
        if (containerRef.current && typeof(window) !== 'undefined') {
            const manager = new Hammer.Manager(containerRef.current)
            console.log('manager:', manager)
            const Swipe = new Hammer.Swipe()
            manager.add(Swipe)

            manager.on('swipe', function(e) {
                const direction = e.offsetDirection
                console.log('direction:', direction)
                if (direction === 2) {
                    hate()
                } else if (direction === 4) {
                    if (likeTrigger) {
                        return
                    }
                    setLikeTrigger(true)
                    like()
                   
        
                    setTimeout(() => {
                        setLikeTrigger(false)
                    }, 1600)
                }
            })

            return () => {
                manager.off('swipe')
            }
        }
    }, [])

    async function like() {
        setActionStyle(styles.like)
                
        setTimeout(() => {
            setActionStyle(null)
            getnext()
        }, 1000)
        try {
            await httpAuthPost('/project/like?id=' + infoData2!.id, {})
        } catch(e) {

        }
        
    }

    async function hate() {
        setActionStyle(styles.hate)
        setTimeout(() => {
            setActionStyle(null)
            getnext()
        }, 1000)
        try { 
            await httpAuthPost('/project/un_like?id=' + infoData2!.id, {})
        } catch {

        }
    }

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
                <ConnectButton />

                {/* <div className={styles.notice}>
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
                </div> */}
            </div>
        </div>

        <div className={styles.thumbnailListBox} ref={containerRef}>
            {
                infoData && <div className={[styles.thumbnailBox].join(' ')}>
                    <Thumbnail showDesc={true} data={infoData} />
                </div>
            }

            {
                infoData2 && <div className={[styles.thumbnailBox, actionStyle].join(' ')}>
                    <Thumbnail showDesc={true} data={infoData2} />
                </div>
            }
        </div>

        <Action
            token={infoData2}
            onLike={async () => {
                like()
            }} 
            onHate={async () => {
                hate()
            }} 
            onSuperLike={() => { }}
            onBoost={() => { }} />
    </div>
}


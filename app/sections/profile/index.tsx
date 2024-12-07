import { useRouter, usePathname } from 'next/navigation'
import Created from './components/created'
import Held from './components/held'
import Tab from './components/tab'
import styles from './profile.module.css'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Modal } from 'antd-mobile'
import BoostVip from '@/app/components/boost/boostVip'
import { httpAuthGet } from '@/app/utils'

import type { UserInfo } from '@/app/type/index'
import useUserInfo from './hooks/useUserInfo'
import { useAccount } from '@/app/hooks/useAccount';

interface Props {
    showHot?: boolean;
}

export default function Profile({
    showHot = true
}: Props) {
    const router = useRouter()
    const { address } = useAccount()
    const { userInfo } = useUserInfo(address)

    const tabs = useMemo(() => {
        const _tabs = [{
            name: 'Held',
            content: <Held />
        }, {
            name: 'Created',
            content: <Created address={address} type="created" />
        }, {
            name: 'Liked',
            content: <Created address={address} type="liked" />
        }]

        if (showHot) {
            _tabs.splice(2, 0, {
                name: 'Hot',
                content: <Created address={address} type="hot" />
            })
        }

        return _tabs
    }, [showHot, address])


    const showVip = useCallback(() => {
        const vipHandler = Modal.show({
            content: <BoostVip onStartVip={() => {
                vipHandler.close()
            }} onCanceVip={() => {
                vipHandler.close()
            }} />,
            closeOnMaskClick: true,
        })
    }, [])

    const backgroundImgStyle = userInfo?.banner ? {
        backgroundImage: `linear-gradient(360deg, #0D1012 41.35%, rgba(0, 0, 0, 0) 100%)`,
        backgroundSize: '100% auto'
    } : {}

    const backgroundImgStyle1 = userInfo?.banner ? {
        backgroundImage: `url(${userInfo?.banner})`,
        backgroundSize: '100% auto'
    } : {}

    return <div className={styles.main} >
        <div style={backgroundImgStyle1}>
            <div className={styles.avatarContent} style={backgroundImgStyle}>
                <div className={styles.avatar}>
                    <img className={styles.avatarImg} src={userInfo?.icon} />
                    <div className={styles.pencil} onClick={() => {
                        router.push('/profile/edit')
                    }}>
                        <Pencil />
                    </div>
                </div>

                <div className={styles.useName}>{userInfo?.name}</div>
            </div>
        </div>
        <div className={styles.follwerActions}>
            <div className={styles.follwerItem} onClick={() => {
                router.push('/profile/follower/' + address)
            }}>
                <span className={styles.follwerAmount}>{userInfo?.followers}</span>
                <span>Followers</span>
            </div>
            <div className={styles.follwerItem} onClick={() => {
                router.push('/profile/follower/' + address)
            }}>
                <span className={styles.follwerAmount}>{userInfo?.following}</span>
                <span>Following</span>
            </div>
            <div className={styles.follwerItem}>
                <span className={styles.follwerAmount}>{userInfo?.likeNum}</span>
                <span>Likes</span>
            </div>
        </div>

        <div className={styles.addressContent} onClick={() => {
            window.open(`https://solscan.io/account/${address}?cluster=devnet`)
        }}>
            <div className={styles.address}>{address}</div>
            <div>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z" fill="#7E8A93" />
                </svg>
            </div>
        </div>

        <div className={styles.hotBoost}>
            <div className={styles.part}>
                <div>
                    <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0117341 16.86C-0.13897 14.5993 1.13341 9.96684 5.48848 7.11148C5.76109 6.93274 6.11902 7.11298 6.1694 7.43504C6.42056 9.04044 6.9197 10.0828 7.79399 10.9437C7.91236 11.0603 8.08854 11.0938 8.24353 11.034C11.6839 9.70598 14.3634 7.03375 13.4136 0.519094C13.3612 0.159544 13.7224 -0.121444 14.041 0.0532762C17.9652 2.20542 24.8401 8.45132 24.735 16.86C24.735 26.4122 16.8685 29.6712 12.1486 29.6712C7.42871 29.6712 0.0117341 25.9627 0.0117341 16.86ZM5.18656 15.2327C4.6702 16.0105 4.39439 16.9268 4.39441 17.8644C4.3938 18.5457 4.53919 19.2189 4.82051 19.8376C5.10183 20.4563 5.51236 21.0056 6.02369 21.4475L11.1461 26.01C11.4309 26.2636 11.7953 26.4062 12.1742 26.4123C12.5531 26.4183 12.9218 26.2874 13.2142 26.0429L18.4734 21.6487C19.0575 21.2117 19.532 20.6414 19.8584 19.984C20.1848 19.3266 20.3539 18.6005 20.3521 17.8644C20.3522 16.9268 20.0763 16.0105 19.56 15.2327C19.0436 14.4549 18.3102 13.851 17.4535 13.4981C16.5968 13.1453 15.6557 13.0597 14.7508 13.2521C14.1515 13.3796 13.5862 13.6251 13.0854 13.9716C12.665 14.2624 12.0816 14.2624 11.6612 13.9716C11.1604 13.6251 10.595 13.3796 9.99579 13.2521C9.09081 13.0597 8.14979 13.1453 7.29308 13.4981C6.43637 13.851 5.70293 14.4549 5.18656 15.2327ZM10.1241 17.0346C10.3193 16.9321 10.53 17.1428 10.4276 17.338L9.90004 18.3432C9.86572 18.4086 9.86572 18.4867 9.90004 18.5521L10.4276 19.5572C10.53 19.7524 10.3193 19.9631 10.1241 19.8606L9.11897 19.3331C9.05357 19.2988 8.97548 19.2988 8.91008 19.3331L7.90496 19.8606C7.70971 19.9631 7.49903 19.7524 7.6015 19.5572L8.12901 18.5521C8.16333 18.4867 8.16333 18.4086 8.12901 18.3432L7.6015 17.338C7.49903 17.1428 7.70971 16.9321 7.90496 17.0346L8.91008 17.5621C8.97548 17.5964 9.05357 17.5964 9.11897 17.5621L10.1241 17.0346ZM17.3952 17.338C17.4977 17.1428 17.287 16.9321 17.0917 17.0346L16.0866 17.5621C16.0212 17.5964 15.9431 17.5964 15.8777 17.5621L14.8726 17.0346C14.6774 16.9321 14.4667 17.1428 14.5691 17.338L15.0967 18.3432C15.131 18.4086 15.131 18.4867 15.0967 18.5521L14.5691 19.5572C14.4667 19.7524 14.6774 19.9631 14.8726 19.8606L15.8777 19.3331C15.9431 19.2988 16.0212 19.2988 16.0866 19.3331L17.0917 19.8606C17.287 19.9631 17.4977 19.7524 17.3952 19.5572L16.8677 18.5521C16.8334 18.4867 16.8334 18.4086 16.8677 18.3432L17.3952 17.338Z" fill="url(#paint0_linear_89_8920)" />
                        <defs>
                            <linearGradient id="paint0_linear_89_8920" x1="12.3681" y1="0" x2="12.3681" y2="29.6712" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#D9ABFF" />
                                <stop offset="1" stop-color="#B65AFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className={styles.nameContent}>
                    <div className={styles.names}>
                        <span><span className={styles.whiteName}>0</span> /2 </span>
                        <span>Smoky Hot</span>
                    </div>
                    <div onClick={() => {
                        showVip()
                    }} className={styles.getMore1}>Get more</div>
                </div>
            </div>
            <div className={styles.part}>
                <div>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#B1FFFA" />
                        <path d="M17.5642 8.01658C18.0078 8.10057 18.2927 8.50051 18.1987 8.90846L17.0142 14.0998L20.5103 15.0346C20.6005 15.0585 20.6859 15.0967 20.7629 15.1476C20.8494 15.2033 20.9232 15.2753 20.9796 15.3592C21.036 15.4432 21.0739 15.5373 21.091 15.6358C21.1081 15.7343 21.1041 15.8351 21.079 15.932C21.054 16.029 21.0086 16.12 20.9455 16.1995L15.0376 23.6885C14.9415 23.8073 14.8125 23.898 14.6653 23.9501C14.5181 24.0023 14.3586 24.0138 14.2048 23.9834C13.7613 23.8984 13.4764 23.4995 13.5693 23.0915L14.7538 17.8992L11.2577 16.9644C11.1669 16.9404 11.0813 16.9014 11.0051 16.8514C10.9186 16.7957 10.8449 16.7237 10.7885 16.6398C10.732 16.5558 10.6941 16.4617 10.677 16.3632C10.6599 16.2647 10.664 16.1639 10.689 16.067C10.714 15.97 10.7595 15.879 10.8225 15.7995L16.7314 8.31154C16.8276 8.19267 16.9566 8.10201 17.1038 8.04987C17.251 7.99773 17.4105 7.9862 17.5642 8.01658Z" fill="black" />
                    </svg>
                </div>
                <div className={styles.nameContent}>
                    <div className={styles.names}>
                        <span><span className={styles.whiteName}>0</span> </span>
                        <span>Boost</span>
                    </div>
                    <div onClick={() => {
                        showVip()
                    }} className={styles.getMore2}>Get more</div>
                </div>
            </div>
        </div>

        <Tab nodes={tabs} />
    </div>
}



function Pencil() {
    return <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_17_2962)">
            <circle cx="14.5" cy="14.5" r="14.5" fill="#0D1012" fill-opacity="0.8" />
        </g>
        <path d="M12.1567 18.6329L10.3914 18.8002C10.3368 18.8055 10.2817 18.7986 10.23 18.7801C10.1783 18.7615 10.1314 18.7318 10.0925 18.693C10.0537 18.6542 10.0239 18.6073 10.0052 18.5557C9.98662 18.504 9.97964 18.4489 9.9848 18.3943L10.1521 16.629C10.1725 16.4134 10.2677 16.2115 10.4214 16.0578L16.9568 9.52231C17.0434 9.43575 17.1461 9.36708 17.2591 9.32023C17.3722 9.27338 17.4934 9.24927 17.6158 9.24927C17.7381 9.24927 17.8593 9.27338 17.9724 9.32023C18.0855 9.36708 18.1882 9.43575 18.2747 9.52231L19.2634 10.511C19.35 10.5975 19.4186 10.7003 19.4655 10.8133C19.5123 10.9264 19.5364 11.0476 19.5364 11.1699C19.5364 11.2923 19.5123 11.4135 19.4655 11.5266C19.4186 11.6396 19.35 11.7424 19.2634 11.8289L12.7272 18.365C12.5738 18.518 12.3718 18.6127 12.156 18.6329H12.1567Z" fill="#7E8A93" />
        <path d="M10.3554 19.2329C10.2436 19.2328 10.1331 19.2094 10.0309 19.1641C9.92874 19.1189 9.83713 19.0528 9.76198 18.9701C9.68682 18.8874 9.62977 18.7899 9.59448 18.6838C9.5592 18.5778 9.54645 18.4656 9.55705 18.3543L9.72433 16.589C9.75425 16.2735 9.89297 15.9784 10.1167 15.754L16.6529 9.21919C16.9084 8.96423 17.2547 8.82104 17.6157 8.82104C17.9767 8.82104 18.323 8.96423 18.5786 9.21919L19.5673 10.2079C19.6939 10.3343 19.7943 10.4844 19.8628 10.6496C19.9313 10.8148 19.9666 10.9919 19.9666 11.1708C19.9666 11.3496 19.9313 11.5268 19.8628 11.692C19.7943 11.8572 19.6939 12.0073 19.5673 12.1337L13.0312 18.6685C12.8068 18.8929 12.5123 19.0309 12.1968 19.0615L10.4322 19.2288C10.4067 19.2311 10.381 19.2322 10.3554 19.2322V19.2329ZM17.6157 9.67887C17.5498 9.67877 17.4845 9.69169 17.4236 9.7169C17.3627 9.7421 17.3074 9.77909 17.2608 9.82575L10.7246 16.3619C10.6423 16.4447 10.5913 16.5536 10.5805 16.6699L10.4193 18.3665L12.1159 18.2061C12.2321 18.1947 12.3408 18.1433 12.4233 18.0605L18.9594 11.5244C19.006 11.4778 19.043 11.4224 19.0683 11.3615C19.0935 11.3006 19.1065 11.2354 19.1065 11.1694C19.1065 11.1035 19.0935 11.0382 19.0683 10.9773C19.043 10.9164 19.006 10.8611 18.9594 10.8145L17.9707 9.82575C17.9241 9.77916 17.8688 9.74225 17.8078 9.71716C17.7469 9.69206 17.6816 9.67928 17.6157 9.67955V9.67887ZM9.54277 19.9713H20.3514C20.6621 19.9713 20.8172 20.1271 20.8172 20.4371C20.8172 20.7479 20.6621 20.9036 20.3514 20.9036H9.54209C9.23201 20.9036 9.07629 20.7479 9.07629 20.4378C9.07629 20.1271 9.23201 19.9713 9.54209 19.9713H9.54277Z" fill="#7E8A93" />
        <defs>
            <filter id="filter0_b_17_2962" x="-4" y="-4" width="37" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_17_2962" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_17_2962" result="shape" />
            </filter>
        </defs>
    </svg>

}
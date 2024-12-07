import Link from 'next/link';
import Tags from '../tags'
import styles from './thumbnail.module.css'
import type { Project } from '@/app/type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
    showDesc: boolean;
    topDesc?: boolean;
    showProgress?: boolean;
    data: Project;
    autoHeight?: boolean;
    showBackIcon?: boolean;
}

export default function Thumbnail({
    showDesc = true,
    topDesc = false,
    showProgress = false,
    autoHeight = false,
    showBackIcon = true,
    data
}: Props) {
    const [progressIndex, setProgressIndex] = useState(0)

    if (!data) {
        return
    }

    return <div>
        {
            topDesc && <AvatarBack data={data} showBackIcon={showBackIcon}/>
        }

        <div className={styles.thumbnail} style={{ height: autoHeight ? 'auto' : 'calc(100vh - 232px)' }}>
            {
                showProgress && <div className={styles.picProgress}>
                    <div onClick={() => { setProgressIndex(0) }} className={[styles.progressItem, progressIndex === 0 ? styles.active : ''].join(' ')}></div>
                    <div onClick={() => { setProgressIndex(1) }} className={[styles.progressItem, progressIndex === 1 ? styles.active : ''].join(' ')}></div>
                    <div onClick={() => { setProgressIndex(2) }} className={[styles.progressItem, progressIndex === 2 ? styles.active : ''].join(' ')}></div>
                </div>
            }

            <div className={styles.imgList}>
                <img className={styles.tokenImg} src={ data.tokenImg }/>
            </div>

            {
                showDesc && <div className={styles.descContent}>
                    <div className={styles.likeNums}>
                        <div className={[styles.likes, styles.likeCustom].join(' ')}>
                            <LikeIcon />
                            <span className={ styles.likesNums }>{ data.like }</span>
                        </div>
                        <div className={[styles.superLikes, styles.likeCustom].join(' ')}>
                            <SuperLikeIcon />
                            <span className={styles.tips}>Smoky<br />HOT</span>
                            <span className={ styles.likesNums }>{ data.superLike }</span>
                        </div>
                    </div>

                    <div className={styles.tokenMsg}>
                        <Avatar data={data} />

                        <div className={styles.desc}>{ data.about }</div>

                        <div className={styles.detailLink}>
                            <Link href={"/detail?id=" + data.id}>
                                <Arrow />
                            </Link>
                        </div>
                    </div>
                    <Tags data={data}/>
                </div>
            }
        </div>
    </div>
}

function LikeIcon() {
    return <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.3 0C1.47746 0 0 1.43474 0 3.20455C0 6.4091 3.9 9.32233 6 10C8.1 9.32233 12 6.4091 12 3.20455C12 1.43474 10.5225 0 8.7 0C7.58391 0 6.59721 0.538044 6 1.36158C5.40279 0.538044 4.41609 0 3.3 0Z" fill="white" />
    </svg>

}

function SuperLikeIcon() {
    return <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.00698843 10.0413C-0.0827662 8.69489 0.675021 5.93592 3.26876 4.23536C3.43111 4.12891 3.64428 4.23625 3.67429 4.42806C3.82387 5.38418 4.12114 6.005 4.64184 6.51773C4.71234 6.58715 4.81727 6.60709 4.90957 6.57146C6.95857 5.78056 8.55436 4.18907 7.98871 0.309155C7.95749 0.095019 8.17261 -0.0723279 8.36235 0.0317295C10.6995 1.31347 14.7939 5.03332 14.7313 10.0413C14.7313 15.7302 10.0463 17.6712 7.23531 17.6712C4.42429 17.6712 0.00698843 15.4625 0.00698843 10.0413ZM3.08893 9.07205C2.7814 9.53528 2.61713 10.081 2.61714 10.6394C2.61678 11.0452 2.70337 11.4461 2.87091 11.8146C3.03846 12.183 3.28296 12.5102 3.58749 12.7734L6.63824 15.4907C6.80781 15.6417 7.02486 15.7266 7.25054 15.7302C7.47621 15.7338 7.69578 15.6559 7.86995 15.5103L11.0021 12.8932C11.35 12.633 11.6326 12.2933 11.827 11.9018C12.0214 11.5102 12.1221 11.0778 12.121 10.6394C12.1211 10.081 11.9568 9.53528 11.6493 9.07205C11.3417 8.60882 10.9049 8.24914 10.3947 8.03902C9.88446 7.82889 9.32401 7.77788 8.78504 7.89251C8.42817 7.9684 8.09145 8.11463 7.79319 8.32098C7.54283 8.4942 7.19536 8.4942 6.94499 8.32098C6.64673 8.11463 6.31001 7.9684 5.95314 7.89251C5.41417 7.77788 4.85372 7.82889 4.3435 8.03902C3.83327 8.24914 3.39645 8.60882 3.08893 9.07205ZM6.02954 10.1452C6.14582 10.0842 6.2713 10.2097 6.21027 10.326L5.8961 10.9246C5.87566 10.9635 5.87566 11.0101 5.8961 11.049L6.21027 11.6476C6.2713 11.7639 6.14582 11.8894 6.02954 11.8284L5.43092 11.5142C5.39197 11.4937 5.34546 11.4937 5.30651 11.5142L4.70789 11.8284C4.59161 11.8894 4.46614 11.7639 4.52716 11.6476L4.84133 11.049C4.86177 11.0101 4.86177 10.9635 4.84133 10.9246L4.52716 10.326C4.46614 10.2097 4.59161 10.0842 4.70789 10.1452L5.30651 10.4594C5.34546 10.4799 5.39197 10.4799 5.43092 10.4594L6.02954 10.1452ZM10.36 10.326C10.4211 10.2097 10.2956 10.0842 10.1793 10.1452L9.58069 10.4594C9.54174 10.4799 9.49523 10.4799 9.45628 10.4594L8.85766 10.1452C8.74138 10.0842 8.6159 10.2097 8.67693 10.326L8.9911 10.9246C9.01154 10.9635 9.01154 11.0101 8.9911 11.049L8.67693 11.6476C8.6159 11.7639 8.74138 11.8894 8.85766 11.8284L9.45628 11.5142C9.49523 11.4937 9.54174 11.4937 9.58069 11.5142L10.1793 11.8284C10.2956 11.8894 10.4211 11.7639 10.36 11.6476L10.0459 11.049C10.0254 11.0101 10.0254 10.9635 10.0459 10.9246L10.36 10.326Z" fill="white" />
    </svg>

}

function Arrow() {
    return <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_60_3660)">
            <circle cx="16" cy="16" r="16" fill="black" fill-opacity="0.4" />
        </g>
        <path d="M9 13L15.5 19L22 13" stroke="white" stroke-width="2" stroke-linecap="round" />
        <defs>
            <filter id="filter0_b_60_3660" x="-10" y="-10" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_60_3660" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_60_3660" result="shape" />
            </filter>
        </defs>
    </svg>
}



function TopArrow() {
    const router = useRouter()

    return <div onClick={() => {
        router.back()
    }}><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_1_1274)">
            <circle cx="20" cy="20" r="20" fill="black" fill-opacity="0.4" />
        </g>
        <path d="M14 22L20.5 16L27 22" stroke="white" stroke-width="2" stroke-linecap="round" />
        <defs>
            <filter id="filter0_b_1_1274" x="-10" y="-10" width="60" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1_1274" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1_1274" result="shape" />
            </filter>
        </defs>
    </svg>
    </div>

}

interface AvatarProps {
    data: Project;
    showBackIcon?: boolean;
}

const defaultImg = 'https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect'

export function Avatar({
    data
}: AvatarProps) {
    if (!data) {
        return
    }

    return <div className={styles.titles}>
        <div className={styles.tokenImgBox}>
            <img className={styles.tokenImg} src={data.tokenImg || defaultImg} />
        </div>
        <div>
            <div className={styles.tokenName}>{ data.tokenName }</div>
            <div className={styles.tickerContent1}>
                <div className={styles.ticker}>Ticker: { data.ticker }</div>
                <div className={styles.launchTag}>Pre-Launch</div>
            </div>
        </div>
    </div>
}

export function AvatarBack({
    data,
    showBackIcon = true
}: AvatarProps) {
    return <div className={styles.detailTitle}>
        <Avatar data={data}/>
        {
            showBackIcon && <TopArrow />
        }
    </div>
}
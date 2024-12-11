import Link from 'next/link';
import Tags from '../tags'
import styles from './thumbnail.module.css'
import type { Project } from '@/app/type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CommentComp from '../comment';
import { videoReg } from '../upload';
import Likes from "./likes";

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
    const [progressIndex, setProgressIndex] = useState(0);
    const route = useRouter();

    if (!data) {
        return;
    }

    return (
        <div>
            {topDesc && <AvatarBack data={data} showBackIcon={showBackIcon} />}

            <div
                className={styles.thumbnail}
                style={{ height: autoHeight ? "auto" : "calc(100vh - 232px)" }}
            >
                {showProgress && (
                    <div className={styles.picProgress}>
                        <div
                            onClick={() => {
                                setProgressIndex(0);
                            }}
                            className={[
                                styles.progressItem,
                                progressIndex === 0 ? styles.active : ""
                            ].join(" ")}
                        ></div>
                        <div
                            onClick={() => {
                                setProgressIndex(1);
                            }}
                            className={[
                                styles.progressItem,
                                progressIndex === 1 ? styles.active : ""
                            ].join(" ")}
                        ></div>
                        <div
                            onClick={() => {
                                setProgressIndex(2);
                            }}
                            className={[
                                styles.progressItem,
                                progressIndex === 2 ? styles.active : ""
                            ].join(" ")}
                        ></div>
                    </div>
                )}

                <div className={styles.imgList}>
                    {
                        videoReg.test(data.tokenImg) ? <video width="100%" className={styles.imgPreview} autoPlay={false}>
                            <source src={data.tokenImg} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video> : <img className={styles.tokenImg} src={data.tokenImg} />
                    }
                </div>

                {
                    progressIndex === 1 && <div className={styles.commentList}>
                        <Avatar data={data} showBackIcon={true} />
                        <CommentComp id={data.id} showEdit={false} usePanel={false} />
                    </div>
                }

                {
                    progressIndex === 2 && <div className={styles.commentList}>
                        <Avatar data={data} showBackIcon={true} />
                    </div>
                }

                {
                    (showDesc && progressIndex === 0) && <div className={styles.descContent}>
                        <Likes data={data} />

                        <div className={styles.tokenMsg}>
                            <Avatar data={data} />

                            <div className={styles.desc}>{data.about}</div>

                            <div className={styles.detailLink}>
                                <Link href={"/detail?id=" + data.id}>
                                    <Arrow />
                                </Link>
                            </div>
                        </div>
                        <Tags data={data} />
                    </div>
                }
            </div>


        </div>
    );
}

function Arrow() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_b_60_3660)">
                <circle cx="16" cy="16" r="16" fill="black" fill-opacity="0.4" />
            </g>
            <path
                d="M9 13L15.5 19L22 13"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
            />
            <defs>
                <filter
                    id="filter0_b_60_3660"
                    x="-10"
                    y="-10"
                    width="52"
                    height="52"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                    <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_60_3660"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_60_3660"
                        result="shape"
                    />
                </filter>
            </defs>
        </svg>
    );
}

function TopArrow() {
    const router = useRouter();

    return (
        <div
            onClick={() => {
                router.back();
            }}
        >
            <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter0_b_1_1274)">
                    <circle cx="20" cy="20" r="20" fill="black" fill-opacity="0.4" />
                </g>
                <path
                    d="M14 22L20.5 16L27 22"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                />
                <defs>
                    <filter
                        id="filter0_b_1_1274"
                        x="-10"
                        y="-10"
                        width="60"
                        height="60"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                    >
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                        <feComposite
                            in2="SourceAlpha"
                            operator="in"
                            result="effect1_backgroundBlur_1_1274"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_backgroundBlur_1_1274"
                            result="shape"
                        />
                    </filter>
                </defs>
            </svg>
        </div>
    );
}

interface AvatarProps {
    data: Project;
    showBackIcon?: boolean;
}

// const defaultImg = 'https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect'

export function Avatar({ data, showBackIcon = false }: AvatarProps) {
    const route = useRouter();

    if (!data) {
        return;
    }

    return <div className={styles.titles}>
        <div className={styles.avatarBox}>
            <div className={styles.tokenImgBox}>
                <img className={styles.tokenImg} src={data.tokenIcon} />
            </div>
            <div>
                <div className={styles.tokenName}>{data.tokenName}</div>
                <div className={styles.tickerContent1}>
                    <div className={styles.ticker}>Ticker: {data.ticker}</div>
                    <div className={styles.launchTag}>Pre-Launch</div>
                </div>
            </div>
        </div>
        {
            showBackIcon && (
                <div
                    onClick={() => {
                        route.push("/detail?id=" + data.id);
                    }}
                    className={styles.arrowBox}
                >
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g filter="url(#filter0_b_610_8930)">
                            <circle cx="16" cy="16" r="16" fill="black" fill-opacity="0.4" />
                        </g>
                        <path
                            d="M9 13L15.5 19L22 13"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                        <defs>
                            <filter
                                id="filter0_b_610_8930"
                                x="-10"
                                y="-10"
                                width="52"
                                height="52"
                                filterUnits="userSpaceOnUse"
                                color-interpolation-filters="sRGB"
                            >
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                                <feComposite
                                    in2="SourceAlpha"
                                    operator="in"
                                    result="effect1_backgroundBlur_610_8930"
                                />
                                <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_backgroundBlur_610_8930"
                                    result="shape"
                                />
                            </filter>
                        </defs>
                    </svg>
                </div>
            )
        }
    </div>
}

export function AvatarBack({ data, showBackIcon = true }: AvatarProps) {
    return (
        <div className={styles.detailTitle}>
            <Avatar data={data} />
            {showBackIcon && <TopArrow />}
        </div>
    );
}

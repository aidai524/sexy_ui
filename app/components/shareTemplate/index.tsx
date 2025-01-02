import type { Project } from "@/app/type";
import styles from "./index.module.css";
import html2canvas from "html2canvas";
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import {
    base64ToBlob,
    formatAddress,
    generateRandomString,
    postUpload,
    simplifyNum,
    timeAgo
} from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useUserAgent } from "@/app/context/user-agent";
import { fail } from "@/app/utils/toast";
import { shareToX } from "@/app/utils/share";
import { DotLoading, Modal } from "antd-mobile";
import Likes from "../thumbnail/likes";

interface Props {
    token: Project | undefined;
    show: boolean;
    isNew: boolean;
    onClose: () => void;
}

function ShareTemplate({ token, show, isNew, onClose }: Props, ref: any) {
    const containerRef = useRef(null);
    const { isMobile } = useUserAgent();
    const [isSharing, setIsSharing] = useState(false);

    useImperativeHandle(ref, () => ({
        getShareImg
    }));

    const getShareImg = useCallback(async () => {
        if (token && containerRef.current) {
            const canvas = await html2canvas(containerRef.current, { useCORS: true });

            const base64Url = canvas.toDataURL("image/webp");
            const bloBData = base64ToBlob(base64Url);
            console.log("bloBData:", bloBData);

            const newFileName = generateRandomString(10);
            const url = await postUpload(bloBData[0], newFileName, bloBData[1]);

            console.log("url:", url);

            return url;
        }
    }, [token]);

    const userName = useMemo(() => {
        if (!token) {
            return "";
        }

        if (token.creater) {
            if (token.creater.name) {
                return token.creater.name;
            }

            if (token.creater.address) {
                return formatAddress(token.creater.address);
            }
        }

        if (token.account) {
            return formatAddress(token.account);
        }
        return "-";
    }, [token]);

    const [mc, setMC] = useState<string | number>("-");

    const { getMC, pool } = useTokenTrade({
        tokenName: token?.tokenName as string,
        tokenSymbol: token?.tokenSymbol as string,
        tokenDecimals: token?.tokenDecimals as number,
        loadData: false
    });

    useEffect(() => {
        if (
            pool &&
            pool.length > 0 &&
            token?.DApp === "sexy" &&
            token?.status === 1
        ) {
            getMC().then((res) => {
                setMC(simplifyNum(res as number));
            });
        }
    }, [pool, token]);

    if (!token) {
        return null;
    }

    const CanvasDom = (
        <>
            {
                !isNew && <div className={styles.likeBox}>
                    <Likes data={token} showShare={false} />
                </div>
            }
            <div className={styles.twitterBox}>
                <div className={styles.heart}>
                    <div className={styles.avatar}>
                        {
                            isNew && <div className={styles.isNew}>
                                <svg width="133" height="33" viewBox="0 0 133 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="path-1-outside-1_3968_1087" maskUnits="userSpaceOnUse" x="-6" y="-11" width="147" height="55" fill="black">
                                        <rect fill="white" x="-6" y="-11" width="147" height="55" />
                                        <path d="M30.71 27.324L28.026 27.808V-2.6226e-06H36.078V33H25.606L5.49797 5.192L8.18197 4.708V33H0.129969V-2.6226e-06H10.91L30.71 27.324ZM70.2612 13.42V19.58H46.3692V13.42H70.2612ZM52.0012 16.5L49.8012 30.14L46.3252 26.18H71.6692V33H41.4852L44.0372 16.5L41.4852 -2.6226e-06H71.4492V6.82H46.3252L49.8012 2.86L52.0012 16.5ZM117.792 29.524L115.108 29.568L123.776 -2.6226e-06H132.532L122.192 33H111.588L101.6 4.312H105.076L95.1322 33H84.4842L74.1442 -2.6226e-06H82.9442L91.6122 29.524L88.9722 29.48L98.9602 -2.6226e-06H107.76L117.792 29.524Z" />
                                    </mask>
                                    <path d="M30.71 27.324L28.026 27.808V-2.6226e-06H36.078V33H25.606L5.49797 5.192L8.18197 4.708V33H0.129969V-2.6226e-06H10.91L30.71 27.324ZM70.2612 13.42V19.58H46.3692V13.42H70.2612ZM52.0012 16.5L49.8012 30.14L46.3252 26.18H71.6692V33H41.4852L44.0372 16.5L41.4852 -2.6226e-06H71.4492V6.82H46.3252L49.8012 2.86L52.0012 16.5ZM117.792 29.524L115.108 29.568L123.776 -2.6226e-06H132.532L122.192 33H111.588L101.6 4.312H105.076L95.1322 33H84.4842L74.1442 -2.6226e-06H82.9442L91.6122 29.524L88.9722 29.48L98.9602 -2.6226e-06H107.76L117.792 29.524Z" fill="black" />
                                    <path d="M30.71 27.324L31.7748 33.2288L41.1707 31.5344L35.5685 23.8033L30.71 27.324ZM28.026 27.808H22.026V34.9867L29.0908 33.7128L28.026 27.808ZM28.026 -2.86102e-06V-6H22.026V-2.86102e-06H28.026ZM36.078 -2.86102e-06H42.078V-6H36.078V-2.86102e-06ZM36.078 33V39H42.078V33H36.078ZM25.606 33L20.7439 36.5158L22.5403 39H25.606V33ZM5.49797 5.192L4.43318 -0.712764L-4.95225 0.979687L0.635923 8.70775L5.49797 5.192ZM8.18197 4.708H14.182V-2.47074L7.11718 -1.19676L8.18197 4.708ZM8.18197 33V39H14.182V33H8.18197ZM0.129969 33H-5.87003V39H0.129969V33ZM0.129969 -2.86102e-06V-6H-5.87003V-2.86102e-06H0.129969ZM10.91 -2.86102e-06L15.7685 -3.52065L13.9718 -6H10.91V-2.86102e-06ZM29.6452 21.4192L26.9612 21.9032L29.0908 33.7128L31.7748 33.2288L29.6452 21.4192ZM34.026 27.808V-2.86102e-06H22.026V27.808H34.026ZM28.026 6H36.078V-6H28.026V6ZM30.078 -2.86102e-06V33H42.078V-2.86102e-06H30.078ZM36.078 27H25.606V39H36.078V27ZM30.468 29.4842L10.36 1.67625L0.635923 8.70775L20.7439 36.5158L30.468 29.4842ZM6.56276 11.0968L9.24676 10.6128L7.11718 -1.19676L4.43318 -0.712764L6.56276 11.0968ZM2.18197 4.708V33H14.182V4.708H2.18197ZM8.18197 27H0.129969V39H8.18197V27ZM6.12997 33V-2.86102e-06H-5.87003V33H6.12997ZM0.129969 6H10.91V-6H0.129969V6ZM6.05147 3.52065L25.8515 30.8447L35.5685 23.8033L15.7685 -3.52065L6.05147 3.52065ZM70.2612 13.42H76.2612V7.42H70.2612V13.42ZM70.2612 19.58V25.58H76.2612V19.58H70.2612ZM46.3692 19.58H40.3692V25.58H46.3692V19.58ZM46.3692 13.42V7.42H40.3692V13.42H46.3692ZM52.0012 16.5L57.9246 17.4554L58.0787 16.5L57.9246 15.5446L52.0012 16.5ZM49.8012 30.14L45.2919 34.0981L53.696 43.6725L55.7246 31.0954L49.8012 30.14ZM46.3252 26.18V20.18H33.0749L41.8159 30.1381L46.3252 26.18ZM71.6692 26.18H77.6692V20.18H71.6692V26.18ZM71.6692 33V39H77.6692V33H71.6692ZM41.4852 33L35.5557 32.0829L34.4858 39H41.4852V33ZM44.0372 16.5L49.9667 17.4171L50.1085 16.5L49.9667 15.5829L44.0372 16.5ZM41.4852 -2.86102e-06V-6H34.4858L35.5557 0.917093L41.4852 -2.86102e-06ZM71.4492 -2.86102e-06H77.4492V-6H71.4492V-2.86102e-06ZM71.4492 6.82V12.82H77.4492V6.82H71.4492ZM46.3252 6.82L41.8159 2.86188L33.0749 12.82H46.3252V6.82ZM49.8012 2.86L55.7246 1.9046L53.696 -10.6725L45.2919 -1.09812L49.8012 2.86ZM64.2612 13.42V19.58H76.2612V13.42H64.2612ZM70.2612 13.58H46.3692V25.58H70.2612V13.58ZM52.3692 19.58V13.42H40.3692V19.58H52.3692ZM46.3692 19.42H70.2612V7.42H46.3692V19.42ZM46.0777 15.5446L43.8777 29.1846L55.7246 31.0954L57.9246 17.4554L46.0777 15.5446ZM54.3104 26.1819L50.8344 22.2219L41.8159 30.1381L45.2919 34.0981L54.3104 26.1819ZM46.3252 32.18H71.6692V20.18H46.3252V32.18ZM65.6692 26.18V33H77.6692V26.18H65.6692ZM71.6692 27H41.4852V39H71.6692V27ZM47.4147 33.9171L49.9667 17.4171L38.1077 15.5829L35.5557 32.0829L47.4147 33.9171ZM49.9667 15.5829L47.4147 -0.917098L35.5557 0.917093L38.1077 17.4171L49.9667 15.5829ZM41.4852 6H71.4492V-6H41.4852V6ZM65.4492 -2.86102e-06V6.82H77.4492V-2.86102e-06H65.4492ZM71.4492 0.819999H46.3252V12.82H71.4492V0.819999ZM50.8344 10.7781L54.3104 6.81811L45.2919 -1.09812L41.8159 2.86188L50.8344 10.7781ZM43.8777 3.81539L46.0777 17.4554L57.9246 15.5446L55.7246 1.9046L43.8777 3.81539ZM117.792 29.524L117.891 35.5232L126.122 35.3883L123.473 27.5936L117.792 29.524ZM115.108 29.568L109.35 27.8801L107.058 35.7008L115.207 35.5672L115.108 29.568ZM123.776 -2.86102e-06V-6H119.283L118.018 -1.6879L123.776 -2.86102e-06ZM132.532 -2.86102e-06L138.258 1.79399L140.7 -6H132.532V-2.86102e-06ZM122.192 33V39H126.6L127.918 34.794L122.192 33ZM111.588 33L105.922 34.9728L107.324 39H111.588V33ZM101.6 4.312V-1.688H93.158L95.9338 6.28481L101.6 4.312ZM105.076 4.312L110.745 6.27705L113.506 -1.688H105.076V4.312ZM95.1322 33V39H99.4026L100.801 34.9651L95.1322 33ZM84.4842 33L78.7586 34.794L80.0765 39H84.4842V33ZM74.1442 -2.86102e-06V-6H65.9765L68.4186 1.79399L74.1442 -2.86102e-06ZM82.9442 -2.86102e-06L88.7012 -1.69021L87.4359 -6H82.9442V-2.86102e-06ZM91.6122 29.524L91.5122 35.5232L99.6666 35.6591L97.3692 27.8338L91.6122 29.524ZM88.9722 29.48L83.2895 27.5547L80.651 35.3421L88.8722 35.4792L88.9722 29.48ZM98.9602 -2.86102e-06V-6H94.658L93.2775 -1.92534L98.9602 -2.86102e-06ZM107.76 -2.86102e-06L113.441 -1.93036L112.058 -6H107.76V-2.86102e-06ZM117.694 23.5248L115.01 23.5688L115.207 35.5672L117.891 35.5232L117.694 23.5248ZM120.866 31.2559L129.534 1.68789L118.018 -1.6879L109.35 27.8801L120.866 31.2559ZM123.776 6H132.532V-6H123.776V6ZM126.807 -1.794L116.467 31.206L127.918 34.794L138.258 1.79399L126.807 -1.794ZM122.192 27H111.588V39H122.192V27ZM117.255 31.0272L107.267 2.33919L95.9338 6.28481L105.922 34.9728L117.255 31.0272ZM101.6 10.312H105.076V-1.688H101.6V10.312ZM99.4071 2.34695L89.4631 31.0349L100.801 34.9651L110.745 6.27705L99.4071 2.34695ZM95.1322 27H84.4842V39H95.1322V27ZM90.2097 31.206L79.8697 -1.794L68.4186 1.79399L78.7586 34.794L90.2097 31.206ZM74.1442 6H82.9442V-6H74.1442V6ZM77.1871 1.69021L85.8551 31.2142L97.3692 27.8338L88.7012 -1.69021L77.1871 1.69021ZM91.7121 23.5248L89.0721 23.4808L88.8722 35.4792L91.5122 35.5232L91.7121 23.5248ZM94.6549 31.4053L104.643 1.92533L93.2775 -1.92534L83.2895 27.5547L94.6549 31.4053ZM98.9602 6H107.76V-6H98.9602V6ZM102.079 1.93035L112.111 31.4544L123.473 27.5936L113.441 -1.93036L102.079 1.93035Z" fill="#84FF00" mask="url(#path-1-outside-1_3968_1087)" />
                                </svg>
                            </div>
                        }
                        <img
                            className={styles.avatarImg}
                            src={token.tokenIcon || defaultAvatar}
                        />
                        <LaunchTag type={token.status as number} />
                    </div>
                    <div className={styles.tokenName}>{token.tokenName}</div>
                    {token.ticker && (
                        <div className={styles.ticker}>Ticker:{token.ticker}</div>
                    )}
                </div>
                <div className={styles.details}>
                    <div className={styles.detailsItem}>
                        <div className={styles.detailTitle}>Created by:</div>
                        <div className={styles.detailContent}>{userName}</div>
                    </div>
                    <div className={styles.detailsItem}>
                        <div className={styles.detailTitle}>Create time:</div>
                        <div className={styles.detailContent}>{timeAgo(token.time)}</div>
                    </div>
                    <div className={styles.detailsItem}>
                        <div className={styles.detailTitle}>Market cap:</div>
                        <div className={styles.detailContent}>${mc}</div>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <img className={styles.logoImg} src="/img/logo.svg" />
            </div>
        </>
    );

    return (
        <Modal
            className="no-bg"
            visible={show}
            content={
                <div className={styles.main + " " + (isMobile ? styles.mobileBox : "")}>
                    <div className={styles.box + " " + (isMobile ? styles.isMobile : "")}>
                        {CanvasDom}
                        <div
                            className={styles.shareBtn}
                            onClick={async () => {
                                if (isSharing) {
                                    return;
                                }

                                setIsSharing(true);
                                const img = await getShareImg();
                                if (!img) {
                                    fail("Share fail");
                                    setIsSharing(false);
                                    return;
                                }
                                shareToX(
                                    token.tokenName,
                                    `https://test.flipn.fun/api/twitter?tokenName=${encodeURIComponent(
                                        token.tokenName
                                    )}&about=${encodeURIComponent(
                                        token.about
                                    )}&imgUrl=${encodeURIComponent(img)}&tokenId=${token.id}&referral=${token.address}`
                                );
                                setIsSharing(false);
                            }}
                        >
                            {isSharing ? <DotLoading color="white" /> : "Share"}
                        </div>
                    </div>

                    <div
                        ref={containerRef}
                        className={styles.box + " " + styles.realyDom}
                    >
                        {CanvasDom}
                    </div>
                </div>
            }
            closeOnMaskClick
            closeOnAction
            onClose={() => {
                onClose();
            }}
        />
    );
}

export function LaunchTag({ type }: { type: number }) {
    if (type === 0) {
        return (
            <div className={styles.launchTag + " " + styles.launch1}>Pre-Launch</div>
        );
    }

    if (type === 1) {
        return (
            <div className={styles.launchTag + " " + styles.launch2}>Launching</div>
        );
    }
}

export default forwardRef(ShareTemplate);

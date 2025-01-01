import type { Project } from '@/app/type'
import styles from './index.module.css'
import html2canvas from 'html2canvas'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { base64ToBlob, formatAddress, generateRandomString, postUpload, simplifyNum, timeAgo } from '@/app/utils';
import { defaultAvatar } from '@/app/utils/config';
import { useTokenTrade } from '@/app/hooks/useTokenTrade';
import { useUserAgent } from '@/app/context/user-agent';
import { fail } from '@/app/utils/toast';
import { shareToX } from '@/app/utils/share';
import { DotLoading, Modal } from 'antd-mobile';
import Likes from '../thumbnail/likes';

interface Props {
    token: Project | undefined;
    show: boolean;
    onClose: () => void;
}

function ShareTemplate({ token, show, onClose }: Props, ref: any) {
    const containerRef = useRef(null)
    const { isMobile } = useUserAgent()
    const [isSharing, setIsSharing] = useState(false)

    useImperativeHandle(ref, () => ({
        getShareImg
    }));

    const getShareImg = useCallback(async () => {
        if (token && containerRef.current) {
            const canvas = await html2canvas(containerRef.current, { useCORS: true })

            const base64Url = canvas.toDataURL("image/webp");
            const bloBData = base64ToBlob(base64Url);
            console.log('bloBData:', bloBData)

            const newFileName = generateRandomString(10)
            const url = await postUpload(bloBData[0], newFileName, bloBData[1])

            console.log('url:', url)

            return url
        }
    }, [token])

    const userName = useMemo(() => {
        if (!token) {
            return ''
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
        return null
    }

    const CanvasDom = <>
        <div className={ styles.likeBox }><Likes data={token} showShare={false} /></div>
        <div className={styles.heart}>
            <div className={styles.avatar}>
                <img className={styles.avatarImg} src={token.tokenIcon || defaultAvatar} />
                <LaunchTag type={token.status as number}/>
            </div>
            <div className={styles.tokenName}>{token.tokenName}</div>
            <div className={styles.ticker}>Ticker:{token.ticker}</div>
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
                <div className={styles.detailContent}>{mc}</div>
            </div>
        </div>

        <div className={styles.bottom}>
            <img className={styles.logoImg} src="/img/logo.svg" />
        </div>
    </>

    return <Modal
    className='no-bg'
        visible={show}
        content={<div className={styles.main + ' ' + (isMobile ? styles.mobileBox : '')}>
            <div className={styles.box + ' ' + (isMobile ? styles.isMobile : '')}>
                {CanvasDom}
                <div className={styles.shareBtn} onClick={async () => {
                    if (isSharing) {
                        return
                    }

                    setIsSharing(true)
                    const img = await getShareImg()
                    if (!img) {
                        fail('Share fail')
                        setIsSharing(false)
                        return
                    }
                    shareToX(
                        token.tokenName,
                        `https://test.flipn.fun/api/twitter?tokenName=${encodeURIComponent(token.tokenName)}&about=${encodeURIComponent(token.about)}&imgUrl=${encodeURIComponent(img)}&tokenId=${token.id}`
                    )
                    setIsSharing(false)
                }}>{isSharing ? <DotLoading color='white' /> : 'Share'}</div>
            </div>

            <div ref={containerRef} className={styles.box + ' ' + styles.realyDom}>
                {CanvasDom}
            </div>
        </div>}
        closeOnMaskClick
        closeOnAction
        onClose={() => {
            onClose()
        }}
    />

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

export default forwardRef(ShareTemplate)




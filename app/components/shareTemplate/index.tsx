import type { Project } from '@/app/type'
import styles from './index.module.css'
import html2canvas from 'html2canvas'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { base64ToBlob, formatAddress, generateRandomString, postUpload, timeAgo } from '@/app/utils';
import { defaultAvatar } from '@/app/utils/config';
import { useTokenTrade } from '@/app/hooks/useTokenTrade';

interface Props {
    token: Project | undefined;
}

function ShareTemplate({ token }: Props, ref: any) {
    const containerRef = useRef(null)

    useImperativeHandle(ref, () => ({
        getImgUrl: async () => {

            return new Promise((resolcve, reject) => {
                setTimeout(async () => {
                    if (containerRef.current) {
                        const canvas = await html2canvas(containerRef.current, { useCORS: true })
                        console.log(canvas)

                        const imageURL = canvas.toDataURL("image/png");

                        // // Create a temporary link element to trigger the download
                        // const link = document.createElement('a');
                        // link.href = imageURL;
                        // link.download = 'dom-element.png';
                        // link.click();

                        const base64Url = canvas.toDataURL("image/webp");
                        const bloBData = base64ToBlob(base64Url);
                        console.log('bloBData:', bloBData)

                        const newFileName = generateRandomString(10)
                        const url = await postUpload(bloBData[0], newFileName, bloBData[1])

                        console.log('url:', url)
                        resolcve(url)
                    }

                }, 50);
            })

        },
    }));

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
                setMC(res as number);
            });
        }
    }, [pool, token]);

    if (!token) {
        return null
    }

    return <div className={styles.main} ref={containerRef}>
        <div className={styles.heart}>
            <div className={styles.avatar}>
                <img className={styles.avatarImg} src={token.tokenIcon || defaultAvatar} />
            </div>
            <div className={styles.tokenName}>{token.tokenName}</div>
            <div className={styles.ticker}>{token.ticker}</div>
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

        <div className={ styles.bottom }>
            <img className={ styles.logoImg } src="/img/logo.svg" />
        </div>
    </div>
}

export default forwardRef(ShareTemplate)




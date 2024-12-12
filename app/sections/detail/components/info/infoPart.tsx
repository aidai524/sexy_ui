import Thumbnail, { AvatarBack } from '@/app/components/thumbnail'
import Panel from '../../../../components/panel'

import styles from './detail.module.css'
import type { Project } from '@/app/type';
import { formatAddress, timeAgo } from '@/app/utils';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

interface Props {
    showThumbnailHead: boolean;
    showThumbnailProgress?: boolean;
    showBackIcon?: boolean;
    data: Project;
    specialTime?: string;
    showLikes?: boolean;
}

export default function InfoPart({
    showThumbnailHead = false,
    showThumbnailProgress = false,
    showBackIcon = true,
    data,
    specialTime,
    showLikes = true,
}: Props) {
    const router = useRouter()
    const userName = useMemo(() => {
        if (data.creater) {
            return data.creater.name || formatAddress(data.creater.address)
        }

        if (data.account) {
            return formatAddress(data.account)
        }
        return '-'
    }, [data])

    if (!data) {
        return
    }

    console.log('data:', data)

    return <div>
        <Thumbnail showLikes={showLikes} showLaunchType={false} autoHeight={true} showBackIcon={showBackIcon} data={data} showDesc={false} topDesc={showThumbnailHead} showProgress={showThumbnailProgress} />
        <Sep />
        <Panel>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Created by:</div>
                <div onClick={() => {
                    router.push('/profile/user?account=' + data.account)
                }} className={[styles.authorDesc, styles.authorDescEs].join(' ')}>{userName}</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Education:</div>
                <div onClick={() => {
                    router.push('/profile/user?account=' + data.account)
                }} className={[styles.authorDesc, styles.authorDescEs].join(' ')}>{ data.creater.education }</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Create time:</div>
                <div className={styles.authorDesc}>{specialTime ? specialTime : timeAgo(data.time)}</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Market cap:</div>
                <div className={styles.authorDesc}>-</div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>About Us</div>
                <div className={styles.abountDetail}>
                    {data.about}
                </div>
            </div>
        </Panel>

        <Sep />

        {
            data.website && <Panel>
                <div className={styles.aboutUs}>
                    <div className={styles.aboutHeader}>Website</div>
                    <div className={styles.linkDetail}>
                        <a className={styles.link} target='_blank' href={data.website}>{data.website}</a>
                    </div>
                </div>
            </Panel>
        }


        <Sep />

        {
            (data.twitter || data.telegram || data.discord) && <Panel>
                <div className={styles.aboutUs}>
                    <div className={styles.aboutHeader}>Community</div>
                    <div className={styles.communityIcons}>
                        {
                            data.twitter && <a className={styles.link} target='_blank' href={data.twitter}>
                                <img src="/img/community/x.svg" />
                            </a>
                        }

                        {
                            data.telegram && <a className={styles.link} target='_blank' href={data.telegram}>
                                <img src="/img/community/telegram.svg" />
                            </a>
                        }

                        {
                            data.discord && <a className={styles.link} target='_blank' href={data.discord}>
                                <img src="/img/community/discard.svg" />
                            </a>
                        }


                    </div>
                </div>
            </Panel>
        }

    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
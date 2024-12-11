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
}

export default function InfoPart({
    showThumbnailHead = false,
    showThumbnailProgress = false,
    showBackIcon = true,
    data
}: Props) {
    const router = useRouter()

    if (!data) {
        return
    }

    const userName = useMemo(() => {
        if (data.creater) {
            return data.creater.name || formatAddress(data.creater.address)
        }

        if (data.account) {
            return formatAddress(data.account)
        }
        return '-'
    }, [data])

    return <div>
        <Thumbnail autoHeight={true} showBackIcon={showBackIcon} data={data} showDesc={false} topDesc={showThumbnailHead} showProgress={showThumbnailProgress} />
        <Sep />
        <Panel>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Created by:</div>
                <div onClick={() => {
                    router.push('/profile/user?account=' + data.account)
                }} className={[styles.authorDesc, styles.authorDescEs].join(' ')}>{ userName }</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Create time:</div>
                <div className={styles.authorDesc}>{ timeAgo(data.time) }</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorGreenTitle}>Market cap:</div>
                <div className={styles.authorGreenDesc}>-</div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>About Us</div>
                <div className={styles.abountDetail}>
                    { data.about }
                </div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>Website</div>
                <div className={styles.linkDetail}>
                    <a className={styles.link} target='_blank' href={data.website}>{ data.website }</a>
                </div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>Community</div>
                <div className={styles.communityIcons}>
                    <a className={styles.link} target='_blank' href={ data.twitter }>
                        <img src="/img/community/x.svg" />
                    </a>
                    <a className={styles.link} target='_blank' href={ data.telegram }>
                        <img src="/img/community/telegram.svg" />
                    </a>
                    <a className={styles.link} target='_blank' href={ data.discord }>
                        <img src="/img/community/discard.svg" />
                    </a>
                </div>
            </div>
        </Panel>
    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
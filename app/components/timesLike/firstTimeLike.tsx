import type { Project } from '@/app/type'
import styles from './index.module.css'

interface Props {
    data: Project;
    onClose: () => void;
}

export const FIRST_LIKE_TIMES = 10

export default function FirstTimeLike({
    data, onClose
}: Props) {
    return <div className={styles.main}>
        <div className={styles.content}>
            <div className={styles.text}>Share your favorite token on X and get up to 100% Like Boost.</div>
        </div>

        <div className={ styles.actionBox }>
            <div className={ styles.cancel } onClick={() => { onClose && onClose() }}>Later</div>
            <div className={ styles.shareBox }>
                <div>Share Now {'>'}</div>
                <img className={ styles.share } src="/img/home/share.png" />
            </div>
        </div>
    </div>
}
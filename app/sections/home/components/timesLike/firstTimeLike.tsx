import type { Project } from '@/app/type'
import styles from './index.module.css'

interface Props {
    data: Project;
    onClose: () => void;
}

export default function FirstTimeLike({
    data, onClose
}: Props) {
    return <div className={styles.main}>
        <div className={styles.content}>
            <div className={styles.text}>You’ve liked 10 times. </div>
            <div className={styles.text}>
                Now try to <strong>Share</strong> a meme token on X,
                and mining
                <br/>
                <strong>10 $SEXYFI</strong>
            </div>
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
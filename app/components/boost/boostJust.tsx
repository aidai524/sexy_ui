import styles from './boost.module.css'
import BoostIcon from './boostIocn'

interface Props {
    onBoost: () => void;
}

export default function BoostInit({
    onBoost
}: Props) {
    return <div className={styles.panel}>
        <div className={styles.boostInit}>
            <div className={styles.initTipContent}>
                <BoostIcon />
                <div className={styles.initTitle}>Boost</div>
                <div className={styles.initAmount}>2/2</div>
                <div className={styles.initTip}>Boost allows the MEME exposure up to 8.5x in SexyFi for 30 minutes.
                    VIP users will have 2 chances per day to boost MEMEs.</div>
            </div>
        </div>

        <div onClick={() => {
            onBoost()
        }} className={ styles.sureBtn }>Boost Now</div>
    </div> 
}
import type { Project } from '@/app/type'
import styles from './index.module.css'
import MainBtn from '@/app/components/mainBtn';

interface Props {
    data: Project;
    onClose: () => void;
}

export default function SecondTimeLike({
    data, onClose
}: Props) {
    return <div className={styles.main}>
        <div className={styles.content}>
            <img src="/img/home/times30.svg" className={ styles.topImg } />
            <div className={styles.text}>You’ve liked 30 times. </div>
            <div className={styles.text}>
                Now try to <strong>buy</strong> a meme token, and mining 
                <br/>
                <strong>30 $SEXYFI</strong>
            </div>

            <MainBtn style={{ backgroundColor: 'rgba(109, 181, 0, 1)', marginTop: 30 }}>Buy Now</MainBtn>

            <div className={ styles.learnTip }>Learn about <a className={ styles.learnLink } href="#">{'‘'}How to trade{'’'}</a></div>
        </div>
    </div>
}
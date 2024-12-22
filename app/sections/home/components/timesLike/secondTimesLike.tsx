import type { Project } from '@/app/type'
import styles from './index.module.css'
import MainBtn from '@/app/components/mainBtn';
import { useRouter } from 'next/navigation';

interface Props {
    data: Project;
    onClose: () => void;
}

export default function SecondTimeLike({
    data, onClose
}: Props) {
    const router = useRouter()

    return <div className={styles.main}>
        <div className={styles.content}>
            <img src="/img/home/times30.svg" className={ styles.topImg } />
            <div className={styles.text}>Share your favorite token on X and get up to 100% Like Boost.</div>
            <div className={styles.text}>
                Buy or sell Sexy or Pump platform tokens on Sexy and earn up to 
                <br/>
                <strong>300% mining bonus</strong>.
            </div>

            <MainBtn onClick={() => { 
                router.push('/?launchType=1')
             }} style={{ backgroundColor: 'rgba(109, 181, 0, 1)', marginTop: 30 }}>Buy Now</MainBtn>

            <div className={ styles.learnTip }>Learn about <a className={ styles.learnLink } href="#">{'‘'}How to trade{'’'}</a></div>
        </div>
    </div>
}
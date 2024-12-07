import { useVip } from '@/app/hooks/useVip';
import styles from './boost.module.css'
import BoostIcon from './boostIocn'
import { fail, success } from '@/app/utils/toast';
import MainBtn from '../mainBtn';
import { useState } from 'react';

interface Props {
    onBoost: () => void;
}

export default function BoostInit({
    onBoost
}: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const { call } = useVip()

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

        <MainBtn isLoading={isLoading} onClick={async () => {
            try {
                setIsLoading(true)
                await call('boost')
                success('Transition success')
                setIsLoading(false)
                onBoost()
            } catch(e) {
                console.log(e)
                setIsLoading(false)
                fail('Transition fail')
            }
        }} style={{ marginTop: 10 }} >Boost Now</MainBtn>
    </div> 
}
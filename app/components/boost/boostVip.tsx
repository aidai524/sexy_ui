import { useVip } from '@/app/hooks/useVip';
import styles from './boost.module.css'
import BoostIcon from './boostIocn'
import { fail, success } from '@/app/utils/toast';

interface Props {
    onStartVip: () => void;
    onCanceVip: () => void;
}

export default function BoostVip({
    onStartVip, onCanceVip
}: Props) {
    const { call } = useVip()

    return <div className={styles.vipBox}>
        <div className={ styles.vipLogo }>
            <img src="/img/home/vipLogo.svg" />
        </div>

        <div className={ styles.right }>
            <div className={ styles.rightItem }>
                <div className={ styles.rightTitle }>Rights</div>
                <div className={ styles.rightValue }>Like</div>
                <div className={ styles.rightValue }>Smoky Hot</div>
                <div className={ styles.rightValue }>Boost</div>
            </div>

            <div className={ styles.rightItem }>
                <div className={ styles.rightTitle }>Free</div>
                <div className={ styles.rightValue }>100/D</div>
                <div className={ styles.rightValue }>2/D</div>
                <div className={ styles.rightValue }>-</div>
            </div>

            <div className={ styles.rightItem + ' ' + styles.vipItem }>
                <div className={ styles.rightTitle }>VIP</div>
                <div className={ styles.rightValue }>200/D</div>
                <div className={ styles.rightValue }>6/D</div>
                <div className={ styles.rightValue }>2/D</div>
            </div>
        </div>

        <div onClick={async () => {
            try {
                await call('vip')
                success('Transition success')
                onStartVip()
            } catch(e) {
                console.log(e)
                fail('Transition fail')
            }
        }} className={styles.sureBtn}>0.05 SOL / Month</div>
        <div onClick={() => {
            onCanceVip()
        }} className={styles.cancelBtn}>No, Thanks</div>
    </div>



}
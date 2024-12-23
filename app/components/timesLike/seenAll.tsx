import type { Project } from '@/app/type'
import styles from './index.module.css'
import MainBtn from '@/app/components/mainBtn';
import { useRouter } from 'next/navigation';
import { Modal } from 'antd-mobile';
import { useHomeTab } from '@/app/store/useHomeTab';

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function SeenAll({
    show, onClose
}: Props) {
    const router = useRouter()
    const { homeTabIndex, set: setHomeTabIndex }: any = useHomeTab()

    return <Modal
        visible={show}
        className='no-bg'
        content={<div className={styles.main}>
            <div className={styles.content}>
                <img src="/img/home/times30.svg" className={styles.topImg} />
                <div className={styles.text}>You have seen all the Pre-Launch tokens.</div>
                <div className={styles.text}>
                    Buy or sell Sexy or Pump platform tokens on Sexy and earn up to
                    <br />
                    <strong>300% mining bonus</strong>.
                </div>

                <MainBtn onClick={() => {
                    setHomeTabIndex({
                        homeTabIndex: 1
                    })
                    // router.push('/?launchType=1')
                }} style={{ backgroundColor: 'rgba(109, 181, 0, 1)', marginTop: 30 }}>Buy Now</MainBtn>

                <div className={styles.learnTip}>Learn about <a className={styles.learnLink} href="#">{'‘'}How to trade{'’'}</a></div>
            </div>
        </div>}
        closeOnMaskClick
        closeOnAction
        onClose={() => {
            onClose()
        }}
    />
}
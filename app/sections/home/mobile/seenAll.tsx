import { useHomeTab } from '@/app/store/useHomeTab';
import styles from './home.module.css'


interface Props {
    show: boolean;
}

export default function SeenAll({ show }: Props) {
    const { homeTabIndex, set: setHomeTabIndex }: any = useHomeTab();

    if (!show) {
        return null
    }
    return <div className={ styles.sellAll }>
        <img className={ styles.sellAllImg } src="/img/home/empty.png" />
        <div className={ styles.textMain }>That's all done...</div>
        <div className={ styles.textMain2 }>You can go to <span onClick={() => {
            setHomeTabIndex({
                homeTabIndex: 1
              });
        }} className={ styles.textMore }>Launching/ed.</span></div>
    </div>
}
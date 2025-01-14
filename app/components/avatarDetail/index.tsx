import type { Project } from '@/app/type'
import styles from './index.module.css'
import { simplifyNum } from '@/app/utils';
import LaunchTag from '../tag/status';

interface Props {
    token: Project;
    mc: number | string | undefined;
}

export default function AvatarDetail({ token, mc }: Props) {
    return <div className={styles.avatarBox}>
        <div className={styles.tokenImgBox} >
            <img
                className={styles.tokenImg}
                src={token.tokenIcon || "/img/token-icon-placeholder.svg"}
            />
        </div>
        <div className={styles.InfoWrapper}>
            <div className={styles.nameWrapper}>
                <div className={styles.name}>{token.tokenName}</div>
                <LaunchTag type={token.status as number} />
                
            </div>
            <div className={styles.ticker}>Ticker: <span className={ styles.dec }>{token.ticker}</span></div>
            <div className={styles.mc}>Market cap:  {mc === 0 || mc === "0"
                ? "-"
                : `$${simplifyNum(mc as number, 2)}`}</div>
        </div>
    </div>
}
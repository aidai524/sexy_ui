import Thumbnail, { AvatarBack } from '@/app/components/thumbnail'
import Comment from '@/app/components/comment'
import Panel from '../../../../components/panel'


import styles from './detail.module.css'
import Action from '@/app/components/action'
import { Button } from 'antd-mobile'
import { useTokenTrade } from '@/app/hooks/useTokenTrade'

export default function Info() {
    const { buyToken, sellToken } = useTokenTrade({
        tokenName: 'Zero',
        tokenSymbol: 'ZERO'
    })

    return <div className={styles.main}>

        {/* <Button onClick={() => {
            buyToken()
        }}>Buy</Button>

        <Button onClick={() => {
            sellToken()
        }}>Sell</Button> */}
      
        {/* <AvatarBack /> */}
        <Thumbnail showDesc={false} />
        <Sep />
        <Panel>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Created by:</div>
                <div className={[styles.authorDesc, styles.authorDescEs].join(' ')}>G76VB875$%^</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorTitle}>Create time:</div>
                <div className={styles.authorDesc}>33 minutes ago</div>
            </div>
            <div className={styles.author}>
                <div className={styles.authorGreenTitle}>Market cap:</div>
                <div className={styles.authorGreenDesc}>G76VB875$%^</div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>About Us</div>
                <div className={styles.abountDetail}>
                    text description text description text description text description text description text description text description text
                </div>
                <div className={styles.abountDetail}>
                    description text description text description text description text description text
                </div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>Project white paper </div>
                <div className={styles.linkDetail}>
                    <a className={styles.link} target='_blank' href="#">https://guide.ref.finance/</a>
                </div>
            </div>
        </Panel>

        <Sep />

        <Panel>
            <div className={styles.aboutUs}>
                <div className={styles.aboutHeader}>Community</div>
                <div className={styles.communityIcons}>
                    <a className={styles.link} target='_blank' href="#">
                        <img src="/img/community/x.svg" />
                    </a>
                    <a className={styles.link} target='_blank' href="#">
                        <img src="/img/community/telegram.svg" />
                    </a>
                    <a className={styles.link} target='_blank' href="#">
                        <img src="/img/community/discard.svg" />
                    </a>
                </div>
            </div>
        </Panel>

        <Comment />

        <div className={styles.action}>
            <Action style={{ position: 'static' }}/>
        </div>

    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
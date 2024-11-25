import Panel from '../panel'
import styles from './comment.module.css'

export default function Comment() {
    return <div className={styles.main}>
        <div className={styles.title}>discussion</div>
        <input className={styles.input} placeholder='Say something...' />
        <Panel>
            <div className={styles.comment}>
                <div className={styles.replyer}>
                    <div className={styles.person}>
                        <div className={styles.avtar}>

                        </div>
                        <div className={styles.name}>xxxxx</div>
                        <div className={styles.time}>xxxx</div>
                    </div>

                    <div className={styles.relayBtn}>Reply</div>
                </div>
                <div className={styles.relayText}>life time sale, before golden bull run!!</div>
            </div>
        </Panel>

        <Sep />

        <Panel>
        <div className={styles.comment}>
                <div className={styles.replyer}>
                    <div className={styles.person}>
                        <div className={styles.avtar}>

                        </div>
                        <div className={styles.name}>xxxxx</div>
                        <div className={styles.time}>xxxx</div>
                    </div>

                    <div className={styles.relayBtn}>Reply</div>
                </div>
                <div className={styles.relayText}>life time sale, before golden bull run!!</div>
            </div>
        </Panel>
    </div>
}

function Sep() {
    return <div style={{ height: 10 }}></div>
}
import styles from './link.module.css'

interface Props {
    type: string;
    img: string;
}

export default function Link({
    type, img
}: Props) {
    return <div className={ styles.linkBox }>
        <div className={styles.linkContent}>
            <div className={styles.linkTitle}>
                <img className={styles.linkImg} src={img} />
                <span>Link to {type}</span>
            </div>
        </div>
        <div className={ styles.linkEdit }>
            <input className={ styles.linkInput } />
            <span className={ styles.linkPaste }>Paste Link</span>
        </div>
    </div>
}
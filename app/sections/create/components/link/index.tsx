import styles from './link.module.css'

interface Props {
    type?: string;
    img?: string;
    value: string;
    onChange: (value: string) => void;
}

export default function Link({
    type, img, value, onChange
}: Props) {
    return <div className={styles.linkBox}>
        {
            type && <div className={styles.linkContent}>
                <div className={styles.linkTitle}>
                    {
                        img && <img className={styles.linkImg} src={img} />
                    }
                    <span>Link to {type}</span>
                </div>
            </div>
        }

        <div className={styles.linkEdit}>
            <input value={value} onChange={(e) => onChange(e.target.value)} className={styles.linkInput} />
            <span onClick={async () => {
                const text = await navigator.clipboard.readText();
                onChange(text)
            }} className={styles.linkPaste}>Paste Link</span>
        </div>
    </div>
}
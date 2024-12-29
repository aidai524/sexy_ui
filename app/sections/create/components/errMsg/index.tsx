import styles from "./index.module.css";

interface Props {
    children?: React.ReactNode;
}

export default function ErrMsg({
    children
}: Props) {
    return <div className={styles.errMsg}>
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="13.1118" cy="13.1118" r="12.1118" stroke="#FF2681" stroke-width="2" />
            <path d="M12.7356 16.0858L12.7355 7.52154" stroke="#FF2681" stroke-width="3" stroke-linecap="round" />
            <circle cx="12.6461" cy="20.0992" r="1.39752" fill="#FF2681" />
        </svg>
        <div className={styles.msgText}>{ children }</div>
    </div>
}

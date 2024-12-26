import styles from "./thumbnail.module.css";

interface Props {
    onClick?: () => void; 
}

export default function LoadMore({ onClick }: Props) {
    return <div className={ styles.loadMore }>
        <div className={ styles.loadBox } onClick={() => {
            onClick && onClick()
        }}>Load more</div>
    </div>
}
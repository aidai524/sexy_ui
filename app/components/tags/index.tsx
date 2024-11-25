import styles from './tags.module.css'

export default function Tags() {
    return <div className={ styles.tags }>
        <Tag />
        <Tag />
    </div>
}

function Tag() {
    return <div className={ styles.tag }>3 Minutes ago</div>
}
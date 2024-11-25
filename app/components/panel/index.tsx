import styles from './panel.module.css'

export default function Panel({ children }: {
    children?: React.ReactNode
}) {
    return <div className={ styles.panel }>
        { children }
    </div>
}
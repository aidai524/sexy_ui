import styles from './index.module.css'

export default function Holder() {
    return  <div className={ styles.distributionArea }>
    <div className={ styles.distributionTitle }>Holder Distribution</div>
    <div className={ styles.list }>
        <div className={ styles.item }>
            <div className={ styles.itemContent }>
                <div style={{ width: 20 }}>1.</div>
                <div>Bro098detum</div>
            </div>
            
            <div className={ styles.itemPercent }>89.2%</div>
        </div>

        <div className={ styles.item }>
            <div className={ styles.itemContent }>
                <div style={{ width: 20 }}>2.</div>
                <div>Bro098detum</div>
            </div>
            
            <div className={ styles.itemPercent }>89.2%</div>
        </div>
    </div>
</div>
}
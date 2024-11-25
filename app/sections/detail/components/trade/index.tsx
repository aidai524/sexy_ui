import { useState } from 'react'
import styles from './trande.module.css'

export default function Trade() {
    const [activeIndex, setActiveIndex] = useState(0)

    return <div className={ styles.main }>
        <div className={ [styles.marketCa, styles.panel].join(' ' ) }>
            <div className={ styles.marketCap }>
                <div className={ styles.mcTitle }>Market cap:</div>
                <div className={ styles.mcAmount }>5.78K</div>
            </div>
            <div className={ styles.ca }>
                <div className={ styles.caAddress }>
                    <div className={ styles.caTtitle }>CA:</div>
                    <div className={ styles.address }>zdfsdfsdfsdf</div>
                </div>

                <div className={ styles.copy }>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="6" width="9" height="9" rx="2" stroke="#979ABE" stroke-width="2"/>
                        <path d="M10 4V3C10 1.89543 9.10457 1 8 1H3C1.89543 1 1 1.89543 1 3V8C1 9.10457 1.89543 10 3 10H4" stroke="#979ABE" stroke-width="2"/>
                    </svg>
                </div>
            </div>
        </div>

        <div className={ [styles.cationArea, styles.panel].join(' ' ) }>
            <div className={ styles.tradeTabs }>
                <div onClick={() => { setActiveIndex(0) }} className={ [styles.tab, activeIndex === 0 ? styles.active : null].join(' ') }>Buy</div>
                <div onClick={() => { setActiveIndex(1) }} className={ [styles.tab, activeIndex === 1 ? styles.active : null].join(' ')  }>Sell</div>
            </div>
        </div>
    </div>
}
import { useState } from 'react';
import styles from './tab.module.css'

export type Node = {
    name: string;
    content: React.ReactNode
}

interface Props {
    nodes: Node[]
}

export default function Tab({
    nodes
}: Props) {
    const [tabIndex, setTabIndex] = useState(0)

    return <div className={styles.tabs}>

        {
            nodes.map((node, index) => {
                if (tabIndex !== index) {
                    return null
                }
                return <div key={index} className={styles.tabContent}>
                    {node.content}
                </div>
            })
        }

        <div className={styles.tabHeaders}>
            {
                nodes.map((node, index) => {
                    return <div key={index} onClick={() => {
                        setTabIndex(index)
                    }} className={(tabIndex === index ? [styles.tab, styles.active] : [styles.tab]).join(' ')}>{node.name}</div>
                })
            }
        </div>
    </div>
}
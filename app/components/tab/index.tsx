import { useEffect, useState } from 'react';
import styles from './tab.module.css'

export type Node = {
    name: string;
    content: React.ReactNode
}

interface Props {
    nodes: Node[];
    activeNode?: string;
    onTabChange?: (nodeName: string) => void;
}

export default function Tab({
    nodes,
    activeNode,
    onTabChange,
}: Props) {
    const [tabIndex, setTabIndex] = useState(0)

    useEffect(() => {
        if (activeNode) {
            let tabIndex = 0
            nodes.some((node, index) => {
                if (node.name === activeNode) {
                    tabIndex = index
                    return true
                }
            })

            setTabIndex(tabIndex)
        }
    }, [activeNode, onTabChange, nodes])

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
                        onTabChange && onTabChange(node.name)
                    }} className={(tabIndex === index ? [styles.tab, styles.active] : [styles.tab]).join(' ')}>{node.name}</div>
                })
            }
        </div>
    </div>
}
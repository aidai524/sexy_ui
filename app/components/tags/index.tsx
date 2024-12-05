import type { Project } from '@/app/type'
import styles from './tags.module.css'

interface Props {
    data: Project
}

export default function Tags({
    data
}: Props) {
    return <div className={ styles.tags }>
        <Tag>Created in { data.time } ago</Tag>
        <Tag><span>Created by</span> <span className={ styles.userName }>{ data.account }</span></Tag>
    </div>
}

function Tag({ children }: { children: React.ReactNode }) {
    return <div className={ styles.tag }> {children }</div>
}
import type { Project } from '@/app/type'
import styles from './tags.module.css'
import { formatAddress, timeAgo } from '@/app/utils'

interface Props {
    data: Project
}

export default function Tags({
    data
}: Props) {
    return <div className={ styles.tags }>
        <Tag>Created in { data.time ? timeAgo(data.time) : 0 }</Tag>
        <Tag><span>Created by</span> <span className={ styles.userName }>{ data.account ? formatAddress(data.account) : '' }</span></Tag>
    </div>
}

function Tag({ children }: { children: React.ReactNode }) {
    return <div className={ styles.tag }> {children }</div>
}
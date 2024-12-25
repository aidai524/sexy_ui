import { PullToRefresh } from "antd-mobile"
import { PullStatus } from "antd-mobile/es/components/pull-to-refresh"

const statusRecord: Record<PullStatus, string> = {
    pulling: 'pulling',
    canRelease: 'canRelease',
    refreshing: 'refreshing...',
    complete: 'loading success',
}

interface Props {
    onRefresh: () => Promise<any>;
    children: React.ReactNode;
}

export default function SexPullToRefresh({
    onRefresh,
    children
}: Props) {
    return <PullToRefresh
        renderText={status => {
            return <div>{statusRecord[status]}</div>
        }}
        onRefresh={async () => {
            await onRefresh()
        }}>{children}</PullToRefresh>
}

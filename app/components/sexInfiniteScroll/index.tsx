import { DotLoading, InfiniteScroll } from "antd-mobile";

interface Props {
    loadMore: () => Promise<any>;
    hasMore: boolean;
}

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
      <>
        {hasMore ? (
          <>
            <span>Loading</span>
            <DotLoading />
          </>
        ) : (
          <span></span>
        )}
      </>
    )
  }

export default function SexInfiniteScroll({ loadMore, hasMore }: Props) {
    return <InfiniteScroll loadMore={loadMore} hasMore={hasMore} >
        <InfiniteScrollContent hasMore={hasMore} />
    </InfiniteScroll>
}
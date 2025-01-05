import { DotLoading, InfiniteScroll } from "antd-mobile";

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
  );
};

export default function SexInfiniteScroll({ loadMore, hasMore }: any) {
  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
      <InfiniteScrollContent hasMore={hasMore} />
    </InfiniteScroll>
  );
}

import { DotLoading, InfiniteScroll } from "antd-mobile";

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
  return (
    <>
      {hasMore ? (
        <div style={{ padding: "10px 0" }}>
          <span>Loading</span>
          <DotLoading />
        </div>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default function SexInfiniteScroll({ loadMore, hasMore }: any) {
  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} style={{ padding: 0 }}>
      <InfiniteScrollContent hasMore={hasMore} />
    </InfiniteScroll>
  );
}

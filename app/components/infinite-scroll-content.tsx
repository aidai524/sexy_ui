const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => (
  <>
    {
      hasMore ? (
        <>Loading...</>
      ) : (
        <span>No more data</span>
      )
    }
  </>
);

export default InfiniteScrollContent;

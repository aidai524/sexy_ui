const InfiniteScrollContent = ({ hasMore, text }: { hasMore?: boolean; text?: string; }) => (
  <>
    {
      hasMore ? (
        <>Loading...</>
      ) : (
        <span>
          {text ? text : 'No more data'}
        </span>
      )
    }
  </>
);

export default InfiniteScrollContent;

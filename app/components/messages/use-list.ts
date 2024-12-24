import { useCallback, useEffect, useRef, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";

const PAGE_SIZE = 50;

export default function useList() {
  const { address: userAddress } = useAccount();
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet(
        `/inform/list?limit=${PAGE_SIZE}&offset=${
          (pageRef.current - 1) * PAGE_SIZE
        }`
      );
      setList([...list, ...(response.data.list || [])]);
      setHasMore(response.data.has_next_page);
    } catch (err) {
      setList([]);
      setHasMore(true);
    } finally {
      setLoading(false);
    }
  }, [list]);

  const onNextPage = () => {
    if (loading || !hasMore) return;
    pageRef.current = pageRef.current + 1;
    onQuery();
  };

  useEffect(() => {
    if (userAddress) onQuery();
  }, [userAddress]);

  return {
    list,
    loading,
    hasMore,
    onQuery,
    onNextPage
  };
}

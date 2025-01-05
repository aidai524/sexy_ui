import { useCallback, useEffect, useRef, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAuth } from "@/app/context/auth";
import useRead from "./use-read";

const PAGE_SIZE = 10;

export default function useList({ onSuccess, showModal }: any) {
  const { accountRefresher } = useAuth();
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const pageRef = useRef(1);
  const { onRead } = useRead();

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet(
        `/inform/list?limit=${PAGE_SIZE}&offset=${
          (pageRef.current - 1) * PAGE_SIZE
        }`
      );
      pageRef.current === 1
        ? setList(response.data.list || [])
        : setList([...list, ...(response.data.list || [])]);

      if (showModal) {
        const ids = response.data.list
          .filter((item: any) => !item.read)
          .map((item: any) => item.id);
        ids.length && onRead({ ids, onSuccess });
      }

      setHasMore(response.data.has_next_page);
    } catch (err) {
      setList([]);
      setHasMore(true);
    } finally {
      setLoading(false);
    }
  }, [list, showModal]);

  const onNextPage = () => {
    if (loading || !hasMore) return;
    pageRef.current = pageRef.current + 1;
    onQuery();
  };

  const onInit = () => {
    pageRef.current = 1;
    onQuery();
  };

  useEffect(() => {
    if (!showModal) return;
    if (accountRefresher) {
      onInit();
    } else {
      setList([]);
    }
  }, [accountRefresher, showModal]);

  return {
    list,
    loading,
    hasMore,
    page: pageRef,
    onQuery,
    onNextPage,
    onInit
  };
}

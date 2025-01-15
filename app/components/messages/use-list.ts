"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAuth } from "@/app/context/auth";
import useRead from "./use-read";

const PAGE_SIZE = 10;

export default function useList() {
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

  const onInit = () => {
    pageRef.current = 1;
    onQuery();
  };

  useEffect(() => {
    if (accountRefresher) {
      onInit();
    } else {
      setList([]);
    }
  }, [accountRefresher]);

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

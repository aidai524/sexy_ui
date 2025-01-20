import { useState, useEffect, useCallback } from "react";
import Empty from "@/app/components/empty";
import CopyList from "./coppiedList";
import CopyTrade from "@/app/services/copyTrade";
import { useAuth } from "@/app/context/auth";
import { fail } from "@/app/utils/toast";
import { useHomeTab } from "@/app/store/useHomeTab";

const MockData = [
  {
    id: 1,
    name: "Copy 1",
    amount: 100,
  },
  {
    id: 2,
    name: "Copy 2",
    amount: 200,
  },
];

export default function Coppied({isOther}: any) {
  const CopyTradeService = new CopyTrade();
  const homeTabStore: any = useHomeTab();
  const { userInfo } = useAuth();
  const [copyTradeMap, setCopyTradeMap] = useState<any>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 10;

  const loadMore = useCallback(async () => {
    if (!userInfo?.address || isOther || homeTabStore?.profileTabIndex !== 0) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await CopyTradeService.getCopyTradeList({
        address: userInfo?.address,
        chain: "solana",
        page: pageIndex,
        pageSize
      });

      setCopyTradeMap((prev: any) => ({
        items: [...prev.items, ...res.data.items],
        total: res.data.total
      }));

      // update page
      if (res.data.items.length < pageSize) {
        setHasMore(false);
      } else {
        setPageIndex(pageIndex + 1);
      }
    } catch (error) {
      fail("Failed to get copy trade list");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.address, isOther, homeTabStore?.profileTabIndex, pageIndex]);

  // init
  useEffect(() => {
    if (!userInfo?.address || isOther || homeTabStore?.profileTabIndex !== 0) return;
    
    // 
    setCopyTradeMap({ items: [], total: 0 });
    setPageIndex(1);
    setHasMore(true);
    loadMore();
  }, [userInfo?.address, homeTabStore?.profileTabIndex]);

  if (isLoading && pageIndex === 1) {
    return (
      <div style={{ paddingTop: 116 }}>
        <Empty text="Loading..." />
      </div>
    );
  }

  if (copyTradeMap?.items?.length === 0) {
    return (
      <div style={{ paddingTop: 116 }}>
        <Empty text="No coppied yet" />
      </div>
    );
  }

  return (
    <CopyList 
      copyTradeList={copyTradeMap?.items}
      hasMore={hasMore}
      loading={isLoading}
      onLoadMore={loadMore}
    />
  );
}

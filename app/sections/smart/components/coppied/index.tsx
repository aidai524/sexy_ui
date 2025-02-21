import { useState, useEffect, useCallback } from "react";
import Empty from "@/app/components/empty";
import CopyList from "./coppiedList";
import CopyTrade from "@/app/services/copyTrade";
import { useAuth } from "@/app/context/auth";
import { fail } from "@/app/utils/toast";
import { useHomeTab } from "@/app/store/useHomeTab";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import {useCloseCopyTrade} from '@/app/sections/profile/hooks/useCloseCopyTrade';
import {useSwapCopyTokens} from '@/app/sections/profile/hooks/useSwapCopyTokens';
import {useWithdrawTokens} from '@/app/sections/profile/hooks/useWithdrawTokens';
import { useUserAgent } from "@/app/context/user-agent";
import CloseCopyTips from "./closeCopyTips";
import styles from './coppied.module.css';
import { useRouter,useSearchParams } from "next/navigation";
export default function Coppied({ isOther }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlAddress = searchParams.get('address');
  const CopyTradeService = new CopyTrade();
  const { isMobile } = useUserAgent();
  const { isLoading: isCloseCopyTradeLoading, handleCloseCopyTrade } = useCloseCopyTrade();
  const { isLoading: isSwapCopyTokensLoading, handleSwapCopyTokens } = useSwapCopyTokens();
  const { isLoading: isWithdrawTokensLoading, handleWithdrawTokens } = useWithdrawTokens();
  const homeTabStore: any = useHomeTab();
  const { userInfo } = useAuth();
  const [copyTradeMap, setCopyTradeMap] = useState<any>({
    items: [],
    total: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [showCloseCopyTips, setShowCloseCopyTips] = useState<boolean>(false);
  const [copiedInfo, setCopiedInfo] = useState<any>(null);
  const pageSize = 10;


  const loadMore = useCallback(async () => {
    if (
      !userInfo?.address && !urlAddress
    ) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await CopyTradeService.getCopyTradeList({
        address:!urlAddress ? userInfo?.address : urlAddress,
        chain: "solana",
        page: pageIndex,
        pageSize
      });

      setCopyTradeMap((prev: any) => ({
        items: [...prev?.items, ...(res?.data?.items || [])],
        total: res?.data?.total || 0
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
  }, [userInfo?.address, urlAddress, pageIndex]);

  useEffect(() => {
    if (!userInfo?.address && !urlAddress) {
      return;
    }
    
    // Reset states
    setPageIndex(1);
    setCopyTradeMap({ items: [], total: 0 });
    setHasMore(true);
    
    // Load initial data
    loadMore();
  }, [userInfo?.address, urlAddress]);

  if (isLoading && pageIndex === 1) {
    return (
      <div style={{ paddingTop: 116 }}>
        <Empty text="Loading" showLoading={true} />
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

  const handleClose = async (item: any) => {
    if (item?.tokens?.length > 0) {
      const res = await handleWithdrawTokens({id: item?.id, walletAddress: userInfo?.address, chain: "solana", tokens: [], type: 2, sellAll: true, closeCopyTrade: true});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
      }
    } else {
      const res = await handleCloseCopyTrade({id: item?.id, walletAddress: userInfo?.address, chain: "solana", state: 4});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
      }
    }
  };

  const handleCloseAndSell = async (item: any) => {
     const swapRes = await handleSwapCopyTokens({id: item?.id, sellAll: true, tokens: [],type:2, walletAddress: userInfo?.address, chain: "solana", closeCopyTrade: true});
     if (swapRes) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore();
     }
  }

  const handleCloseType = (item: any) => {
    if (item?.tokens?.length > 0) {
      setShowCloseCopyTips(true);
      setCopiedInfo(item);
    } else {
      handleClose(item);
    }
  }


  return (
    <>
    <h1 className={styles.title}>Copying ({copyTradeMap?.items?.length || 0})</h1>
    <CopyList
      copyTradeList={copyTradeMap?.items}
      handleCloseCopyTrade={handleCloseType}
      handleCloseAndSell={handleCloseAndSell}
      handleClose={handleClose}
      isCloseCopyTradeLoading={isCloseCopyTradeLoading}
      urlAddress={urlAddress || ""}
    />
    <SexInfiniteScroll 
      loadMore={loadMore} 
      hasMore={hasMore}
    />
    {isMobile && <CloseCopyTips 
      handleCloseAndSell={handleCloseAndSell}
      handleClose={handleClose}
      show={showCloseCopyTips} 
      onClose={() => setShowCloseCopyTips(false)} 
      copiedInfo={copiedInfo} 
    />}
  </>
  );
}


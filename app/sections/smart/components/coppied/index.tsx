import { useState, useEffect, useCallback, useMemo } from "react";
import Empty from "@/app/components/empty";
import CopyList from "./coppiedList";
import CopyTrade from "@/app/services/copyTrade";
import { useAuth } from "@/app/context/auth";
import { fail } from "@/app/utils/toast";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import {useCloseCopyTrade} from '@/app/sections/profile/hooks/useCloseCopyTrade';
import {useSwapCopyTokens} from '@/app/sections/profile/hooks/useSwapCopyTokens';
import {useWithdrawTokens} from '@/app/sections/profile/hooks/useWithdrawTokens';
import { useUserAgent } from "@/app/context/user-agent";
import CloseCopyTips from "./closeCopyTips";
import styles from './coppied.module.css';
import { useRouter,useSearchParams } from "next/navigation";
import { useAccount } from "@/app/hooks/useAccount";
import { useCloseCopy } from "@/app/store/useCloseCopy";
import { success } from "@/app/utils/toast";
import { CopyItemSkeleton } from "./coppiedList/ske";
import Big from "big.js";
import { useTotalPnl } from "@/app/store/use-total-pnl";
export default function Coppied({ isOther }: any) {
  const { address: walletAddress } = useAccount();
  const { lastCloseCopyTime, set: setLastCloseCopyTime }:any = useCloseCopy();
  const { set: setTotalPnl }:any = useTotalPnl();
  const searchParams = useSearchParams();
  const urlAddress = searchParams.get('address');
  const CopyTradeService = new CopyTrade();
  const { isMobile } = useUserAgent();
  const { isLoading: isCloseCopyTradeLoading, handleCloseCopyTrade } = useCloseCopyTrade();
  const { isLoading: isSwapCopyTokensLoading, handleSwapCopyTokens } = useSwapCopyTokens();
  const { isLoading: isWithdrawTokensLoading, handleWithdrawTokens } = useWithdrawTokens();
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
  const [pollingIds, setPollingIds] = useState<Set<string>>(new Set());


  const loadMore = useCallback(async () => {
    if (!userInfo?.address && !urlAddress && !walletAddress) {
      setHasMore(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await CopyTradeService.getCopyTradeList({
        address: !urlAddress ? userInfo?.address || walletAddress : urlAddress,
        chain: "solana",
        page: pageIndex,
        pageSize
      });

      setCopyTradeMap((prev: any) => ({
        items: pageIndex === 1 
          ? res?.data?.items || []
          : [...prev?.items, ...(res?.data?.items || [])],
        total: res?.data?.total || 0
      }));

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
  }, [userInfo?.address, urlAddress, pageIndex, walletAddress]);

  useEffect(() => {
    if (!userInfo?.address && !urlAddress && !walletAddress) {
      return;
    }
    
    // init
    setPageIndex(1);
    setCopyTradeMap({ items: [], total: 0 });
    setHasMore(true);
    
    // 
    setTimeout(() => {
      loadMore();
    }, 0);
  }, [userInfo?.address, urlAddress, walletAddress]);


  const pollCopyTradeStatus = useCallback(async (id: string) => {
    if (!userInfo?.address) {
      setPollingIds(new Set());
      return;
    }
    
    try {
      const res = await CopyTradeService.getCopyTradeDetail({
        id,
        chain: "solana",
        walletAddress: userInfo.address
      });
      
      if (res?.data?.state !== 5) {
        setPollingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        setCopyTradeMap((prev: any) => {
          const updatedItems = prev.items.map((item: any) => {
            if (item.id !== id) return item;
            if (res.data.state === 4) {
              setTimeout(() => {
                setCloseCopyTimeFunc();
                success("Close copy trade success", {maskStyle: {zIndex: 1001}});
              }, 0);
              return null;
            }
            return { ...item, ...res.data };
          }).filter(Boolean);
          return {
            ...prev,
            items: updatedItems
          };
        });
      }
    } catch (error) {
      console.error('Poll status error:', error);
      setPollingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [CopyTradeService, userInfo]);

  // Initialize polling IDs when items change
  useEffect(() => {
    const newPollingIds = new Set<string>();
    copyTradeMap.items.forEach((item: any) => {
      if (item.state === 5) {
        newPollingIds.add(item.id);
      }
    });
    setPollingIds(newPollingIds);
  }, [copyTradeMap.items]);

  // Handle polling separately
  useEffect(() => {
    if (pollingIds.size === 0) return;

    const interval = setInterval(() => {
      pollingIds.forEach(id => {
        pollCopyTradeStatus(id);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [pollingIds, pollCopyTradeStatus]);




  const gasFee = 0.01;
  const rentFee = 0.00089088;
  const itemPnl = useCallback((itemInfo: any) => {
    return new Big(itemInfo?.roi).times(itemInfo.investment + rentFee + gasFee).toString();
  }, []);

  const totalPnl = useMemo(() => {
    return copyTradeMap?.items?.reduce((acc: Big, item: any) => {
      return acc.plus(itemPnl(item));
    }, new Big(0));
  }, [copyTradeMap?.items, itemPnl]);
  
  useEffect(() => {
    setTotalPnl({ totalPnl: totalPnl.toString() });
  }, [totalPnl, setTotalPnl]);



  if (isLoading && pageIndex === 1) {
    return (
      <div>
        <h1 className={styles.title}>Copying ({copyTradeMap?.items?.length || 0})</h1>
        <CopyItemSkeleton />
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
      const res = await handleWithdrawTokens({id: item?.id, walletAddress: userInfo?.address || walletAddress, chain: "solana", tokens: [], type: 2, sellAll: true, closeCopyTrade: true});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
        setCloseCopyTimeFunc();
      }
    } else {
      const res = await handleCloseCopyTrade({id: item?.id, walletAddress: userInfo?.address || walletAddress, chain: "solana", state: 4});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
        setCloseCopyTimeFunc();
      }
    }
  };

  const handleCloseAndSell = async (item: any) => {
     const swapRes = await handleSwapCopyTokens({id: item?.id, sellAll: true, tokens: [],type:2, walletAddress: userInfo?.address || walletAddress, chain: "solana", closeCopyTrade: true});
     if (swapRes) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore();
        setCloseCopyTimeFunc();
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

  const setCloseCopyTimeFunc = () => {
    setLastCloseCopyTime({lastCloseCopyTime: new Date().getTime()});
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


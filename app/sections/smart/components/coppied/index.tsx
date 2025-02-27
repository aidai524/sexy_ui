import { useState, useEffect, useCallback } from "react";
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
export default function Coppied({ isOther }: any) {
  const { address: walletAddress } = useAccount();
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
      // Clear polling if no address
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
        // Stop polling
        setPollingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        // Update list data with more clear logic
        setCopyTradeMap((prev: any) => ({
          ...prev,
          items: prev.items.map((item: any) => {
            if (item.id !== id) return item;
            return res.data.state === 4 ? null : { ...item, ...res.data };
          }).filter(Boolean)
        }));
      }
    } catch (error) {
      console.error('Poll status error:', error);
      // Remove failed polling ID
      setPollingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [CopyTradeService, userInfo]);

  useEffect(() => {
    // Clear existing polling when items change
    setPollingIds(prev => {
      const next = new Set<string>();
      copyTradeMap.items.forEach((item: any) => {
        if (item.state === 5) {
          next.add(item.id);
        }
      });
      return next;
    });

    const interval = setInterval(() => {
      setPollingIds(prev => {
        if (prev.size === 0) return prev;
        prev.forEach(id => {
          pollCopyTradeStatus(id);
        });
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [copyTradeMap.items, pollCopyTradeStatus]);



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
      const res = await handleWithdrawTokens({id: item?.id, walletAddress: userInfo?.address || walletAddress, chain: "solana", tokens: [], type: 2, sellAll: true, closeCopyTrade: true});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
      }
    } else {
      const res = await handleCloseCopyTrade({id: item?.id, walletAddress: userInfo?.address || walletAddress, chain: "solana", state: 4});
      if (res) {
        setPageIndex(1);
        setCopyTradeMap({ items: [], total: 0 });
        setHasMore(true);
        loadMore(); 
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


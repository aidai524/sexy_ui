import { useState, useEffect, useCallback } from 'react';
import CopyTrade from '@/app/services/copyTrade';
import { debounce } from 'lodash-es';

export const useGetSmartMonies = ({chain, page, pageSize, orderBy, walletAddress}: {chain: string, page: number, pageSize: number, orderBy: string, walletAddress: string}) => {
  const copyTradeService = new CopyTrade();
  const [smartMonies, setSmartMonies] = useState<any>({items: [], total: 0});
  const [smartMoniesLoading, setSmartMoniesLoading] = useState(false);

  //
  const debouncedFetchSmartMonies = useCallback(
    debounce(async () => {
      try {
        const res = await copyTradeService.getSmartMonies({ chain, page, pageSize, orderBy, walletAddress });
        setSmartMonies(res?.data || {items: [], total: 0});
      } catch (error) {
        setSmartMonies({items: [], total: 0});
      } finally {
        setSmartMoniesLoading(false);
      }
    }, 350), //
    [chain, page, pageSize, orderBy, walletAddress]
  );

  useEffect(() => {
    setSmartMoniesLoading(true);
    debouncedFetchSmartMonies();
    //
    return () => {
      debouncedFetchSmartMonies.cancel();
    };
  }, [chain, page, pageSize, orderBy, walletAddress]);

  return { smartMonies, smartMoniesLoading };
};


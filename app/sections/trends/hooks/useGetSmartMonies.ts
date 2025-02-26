import { useState, useEffect } from 'react';
import CopyTrade from '@/app/services/copyTrade';

export const useGetSmartMonies = ({chain, page, pageSize, orderBy, walletAddress}: {chain: string, page: number, pageSize: number, orderBy: string, walletAddress: string}) => {
  const copyTradeService = new CopyTrade();
  const [smartMonies, setSmartMonies] = useState<any>({items: [], total: 0});
  const [smartMoniesLoading, setSmartMoniesLoading] = useState(false);

  const fetchSmartMonies = async () => {
    setSmartMoniesLoading(true);
    try {
      const res = await copyTradeService.getSmartMonies({ chain, page, pageSize, orderBy, walletAddress });
      setSmartMonies(res?.data || {items: [], total: 0});
    } catch (error) {
      setSmartMonies({items: [], total: 0});
    } finally {
      setSmartMoniesLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartMonies();
  }, [chain, page, pageSize, orderBy]);

  return { smartMonies, smartMoniesLoading };
};


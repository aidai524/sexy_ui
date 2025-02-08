import { useState, useEffect } from 'react';
import CopyTrade from '@/app/services/copyTrade';

export const useGetSmartMonies = ({chain, page, pageSize, orderBy}: {chain: string, page: number, pageSize: number, orderBy: string}) => {
  const copyTradeService = new CopyTrade();
  const [smartMonies, setSmartMonies] = useState<any>({items: [], total: 0});
  const [smartMoniesLoading, setSmartMoniesLoading] = useState(false);

  const fetchSmartMonies = async () => {
    setSmartMoniesLoading(true);
    const res = await copyTradeService.getSmartMonies({ chain, page, pageSize, orderBy });
    setSmartMonies(res?.data || {items: [], total: 0});
    setSmartMoniesLoading(false);
  };

  useEffect(() => {
    fetchSmartMonies();
  }, [chain, page, pageSize]);

  return { smartMonies, smartMoniesLoading };
};


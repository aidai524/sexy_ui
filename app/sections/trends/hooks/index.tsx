import { useEffect, useState } from 'react';
import { httpGet, timeAgo } from '@/app/utils';
import { useTrendsStore } from '@/app/store/useTrends';

export function useTrends(props: any) {
  const { isPolling } = props;

  const {
    list,
    allList,
    top1,
    setTop1,
    setList,
    setAllList,
  } = useTrendsStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<Record<string, 'asc' | 'desc' | '' | undefined>>({});

  const getList = async () => {
    setLoading(true);
    try {
      const res = await httpGet(`/project/trends/list`, {});
      const _list: Trend[] = res.data.list || [];
      let _top1: Trend = _list[0];
      let _top1Idx = 0;
      _list.forEach((it, index) => {
        if (it.ranking < _top1?.ranking) {
          _top1 = it;
          _top1Idx = index;
        }
        it.created2Now = timeAgo(new Date(it.created_at).getTime(), new Date().getTime());
      });
      const lastList = _list.filter((_, idx) => idx !== _top1Idx);
      setAllList(_list);
      setList(lastList);
      setTop1(_top1);
      setLoading(false);
    } catch (err) {
      console.log('get trends list err: %o', err);
      setLoading(false);
    }
  };

  const handleCurrentFilter = (_currentFilter: number) => {
    if (_currentFilter === currentFilter || loading) return;
    setCurrentFilter(_currentFilter);
    getList();
  };

  const handleOrderBy = (key: string) => {
    if (loading) return;
    if (orderBy[key] === 'asc') {
      setOrderBy({ [key]: 'desc' });
      getList();
      return;
    }
    if (orderBy[key] === 'desc') {
      setOrderBy({ [key]: '' });
      getList();
      return;
    }
    setOrderBy({ [key]: 'asc' });
    getList();
  };

  useEffect(() => {
    console.log('isPolling: %o', isPolling);
    if (!isPolling) return;
    const timer = setInterval(() => {
      getList();
    }, 60000);
    getList();

    return () => {
      clearInterval(timer);
    };
  }, [isPolling]);

  return {
    list,
    allList,
    loading,
    top1,
    currentFilter,
    handleCurrentFilter,
    orderBy,
    handleOrderBy,
  };
}

export interface Trend {
  Icon: string;
  created_at: string;
  id: number;
  market_value: string;
  project_id: number;
  ranking: number;
  sol_amount: string;
  ticker: string;
  time: number;
  token_name: string;
  token_symbol: string;
  updated_at: string;
  virtual_volume: string;
  market_cap_percentage: string;
  project_created: string;
  address: string;
  like: string;
  token_decimals: number;
  token_supply: string;
  token_reserve: string;
  sol_reserve: string;
  market_cap: string;

  // front-end attributes
  created2Now?: string;
}

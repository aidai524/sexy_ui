import { useEffect, useState } from 'react';
import { httpAuthGet, timeAgo } from '@/app/utils';

export function useTrends() {
  const [list, setList] = useState<Trend[]>([]);
  const [allList, setAllList] = useState<Trend[]>([]);
  const [top1, setTop1] = useState<Trend | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<Record<string, 'asc' | 'desc' | '' | undefined>>({});

  const getList = async () => {
    setLoading(true);
    try {
      const res = await httpAuthGet(`/project/trends/list`, {});
      const _list: Trend[] = res.data || [];
      let _top1: Trend = _list[0];
      let _top1Idx = 0;
      _list.forEach((it, index) => {
        if (it.ranking < _top1?.ranking) {
          _top1 = it;
          _top1Idx = index;
        }
        it.created2Now = timeAgo(new Date(it.created_at).getTime(), it.time);
      });
      setAllList(_list);
      setList(_list.filter((_, idx) => idx !== _top1Idx));
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
    const timer = setInterval(() => {
      getList();
    }, 60000);
    getList();

    return () => {
      clearInterval(timer);
    };
  }, []);

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

  // front-end attributes
  created2Now?: string;
}

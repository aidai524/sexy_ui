import { useEffect, useState } from 'react';
import { httpGet, timeAgo } from '@/app/utils';
import { useTrendsStore } from '@/app/store/useTrends';
import { PublicKey } from '@solana/web3.js';
import { programId_address } from '@/app/utils/config';
import Big from 'big.js';
import { Program } from '@coral-xyz/anchor';
import idl from '@/app/hooks/meme_launchpad.json';
import { useConnection } from '@solana/wallet-adapter-react';
import { trim } from 'lodash';
import { useDebounceFn } from 'ahooks';

export function useTrends(props?: { isPollingTop1?: boolean; isListPage?: boolean; }) {
  const { isPollingTop1, isListPage = true } = props ?? {};

  const {
    top1,
    tableList,
    hottestList,
    setTop1,
    setTableList,
    setHottestList,
  } = useTrendsStore();
  const { connection } = useConnection();

  const [top1Loading, setTop1Loading] = useState<boolean>(false);
  const [tableListLoading, setTableListLoading] = useState<boolean>(false);
  const [hottestListLoading, setHottestListLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<Record<string, 'asc' | 'desc' | '' | undefined>>({});
  const [searchText, setSearchText] = useState<string>('');
  const [tableListPageIndex, setTableListPageIndex] = useState<number>(1);
  const [tableListPageMore, setTableListPageMore] = useState<boolean>(true);

  const getPoolToken = async (token: Trend) => {
    const programId = new PublicKey(programId_address);
    const state = PublicKey.findProgramAddressSync(
      [Buffer.from("launchpad")],
      programId
    );
    const pool = PublicKey.findProgramAddressSync(
      [
        Buffer.from("token_info"),
        state[0].toBuffer(),
        Buffer.from(token.token_name),
        Buffer.from(token.token_symbol)
      ],
      programId
    );
    if (!pool?.length) return Big(0);
    const program = new Program<any>(idl, programId, {
      connection: connection
    } as any);
    const poolData: any = await program.account.pool.fetch(pool[0]);
    return Big(poolData!.virtualTokenAmount.toNumber());
  };

  const formatList = async (_list: Trend[] = []) => {
    for (let i = 0; i < _list.length; i++) {
      const it = _list[i];
      it.created2Now = timeAgo(new Date(it.project_created).getTime(), new Date().getTime());
      const poolToken = await getPoolToken(it);
      it.progress = Big(poolToken).minus(295840542120770).div(Big(1095840542120770).minus(295840542120770)).times(100).toFixed(2);
    }
    return _list;
  };

  const getList = async (params: { limit: number; offset?: number; search?: string; }) => {
    try {
      const res = await httpGet(`/project/trends/list`, {
        limit: params.limit,
        offset: params.offset ?? 0,
        text: params.search,
      });
      // const _list: Trend[] = res.data.list || [];
      // let _top1: Trend = _list[0];
      // let _top1Idx = 0;
      // for (let i = 0; i < _list.length; i++) {
      //   const it = _list[i];
      //   if (it.ranking < _top1?.ranking) {
      //     _top1 = it;
      //     _top1Idx = i;
      //   }
      //   it.created2Now = timeAgo(new Date(it.project_created).getTime(), new Date().getTime());
      //   const poolToken = await getPoolToken(it);
      //   it.progress = Big(poolToken).minus(295840542120770).div(Big(1095840542120770).minus(295840542120770)).times(100).toFixed(2);
      // }
      // const lastList = _list.filter((_, idx) => idx !== _top1Idx);
      // setAllList(_list);
      // setList(lastList);
      // setTop1(_top1);
      const _list = await formatList(res.data.list);
      return { list: _list, hasMore: res.data.has_next_page };
    } catch (err) {
      console.log('get trends list err: %o', err);
      return { list: [], hasMore: false };
    }
  };

  const getTop1 = async () => {
    setTop1Loading(true);
    const res = await getList({ limit: 1, search: '' });
    setTop1(res.list[0]);
    setTop1Loading(false);
  };

  const getHottestList = async () => {
    setHottestListLoading(true);
    const res = await getList({ limit: 7, search: '' });
    setHottestList(res.list.slice(1));
    setHottestListLoading(false);
  };

  const getTableList = async (params: { pageIndex: number; }) => {
    setTableListLoading(true);
    const { pageIndex } = params;
    const res = await getList({ limit: 8, offset: pageIndex, search: searchText });
    if (pageIndex === 1) {
      setTableList(res.list);
    } else {
      setTableList([...tableList, ...res.list]);
    }
    setTableListPageMore(res.hasMore);
    setTableListPageIndex(pageIndex + 1);
    setTableListLoading(false);
  };

  const { run: getTableListDelay, cancel: getTableListCancel } = useDebounceFn(getTableList, { wait: 1000 });

  const handleCurrentFilter = (_currentFilter: number) => {
    if (_currentFilter === currentFilter || tableListLoading) return;
    setCurrentFilter(_currentFilter);
    getTableListDelay({ pageIndex: 1 });
  };

  const handleOrderBy = (key: string) => {
    if (tableListLoading) return;
    if (orderBy[key] === 'asc') {
      setOrderBy({ [key]: 'desc' });
      getTableListDelay({ pageIndex: 1 });
      return;
    }
    if (orderBy[key] === 'desc') {
      setOrderBy({ [key]: '' });
      getTableListDelay({ pageIndex: 1 });
      return;
    }
    setOrderBy({ [key]: 'asc' });
    getTableListDelay({ pageIndex: 1 });
  };

  const handleSearchText = (e: any) => {
    let val = e.target.value;
    val = trim(val);
    setSearchText(val);
  };

  useEffect(() => {
    console.log('isPollingTop1: %o', isPollingTop1);
    if (!isPollingTop1) return;
    const timer = setInterval(() => {
      getTop1();
    }, 60000);
    getTop1();

    return () => {
      clearInterval(timer);
    };
  }, [isPollingTop1]);

  useEffect(() => {
    if (!isListPage) return;
    getTableListCancel();
    setTableListPageMore(true);
    getTableListDelay({
      pageIndex: 1,
    });
  }, [searchText]);

  return {
    getTop1,
    getTableList,
    getHottestList,
    top1,
    tableList,
    hottestList,
    top1Loading,
    hottestListLoading,
    tableListLoading,
    tableListPageIndex,
    tableListPageMore,

    currentFilter,
    handleCurrentFilter,
    orderBy,
    handleOrderBy,
    searchText,
    handleSearchText,
    handleSearchTextClear: () => {
      handleSearchText({ target: { value: '' } });
      getTableListDelay({
        pageIndex: 1,
      });
    },
  };
}

export interface Trend {
  Icon: string;
  created_at: string;
  id: number;
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
  project_creator: string;

  // front-end attributes
  created2Now?: string;
  progress?: string;
}

import { useEffect, useState } from 'react';
import { httpGet, timeAgo } from '@/app/utils';
import { useTrendsStore } from '@/app/store/useTrends';
import { PublicKey } from '@solana/web3.js';
import { programId_address, total_supply } from '@/app/utils/config';
import Big from 'big.js';
import { Program } from '@coral-xyz/anchor';
import idl from '@/app/hooks/meme_launchpad.json';
import { useConnection } from '@solana/wallet-adapter-react';
import { trim } from 'lodash';
import { useDebounceFn } from 'ahooks';
import { useConfig } from '@/app/store/useConfig';
import { getTokenMeta } from '@/app/utils/solanaScanApi';

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
  const { config }: any = useConfig();

  const [top1Loading, setTop1Loading] = useState<boolean>(false);
  const [tableListLoading, setTableListLoading] = useState<boolean>(false);
  const [hottestListLoading, setHottestListLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<Record<string, 'asc' | 'desc' | '' | undefined>>({});
  const [searchText, setSearchText] = useState<string>('');
  const [tableListPageIndex, setTableListPageIndex] = useState<number>(0);
  const [tableListPageMore, setTableListPageMore] = useState<boolean>(true);

  const getPoolToken = async (token: Trend) => {
    try {
      // console.log('%ctrends getPoolToken programId_address: %o', 'background:#FF2681;color:#fff;', programId_address);
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
      if (!pool?.length) {
        console.log('%ctrends getPoolToken no pool, will return 0 amount', 'background:#FF2681;color:#fff;');
        return {
          poolAmount: Big(0),
          solAmount: Big(0),
        };
      }
      const program = new Program<any>(idl, programId, {
        connection: connection
      } as any);
      const poolData: any = await program.account.pool.fetch(pool[0]);
      const poolToken = Big(poolData!.virtualTokenAmount.toNumber());
      const solToken = Big(poolData!.virtualWsolAmount.toNumber());
      console.log(
        '%ctrends [%s] result: pool data=%o, pool token amount=%o, sol token amount=%o',
        'background:#FF2681;color:#fff;',
        token?.token_symbol,
        poolData,
        poolToken?.toString?.(),
        solToken?.toString?.(),
      );
      return {
        poolAmount: poolToken,
        solAmount: solToken,
      };
    } catch (err) {
      console.log('%ctrends getPoolToken failed: %o', 'background:#FF2681;color:#fff;', err);
      return {
        poolAmount: Big(0),
        solAmount: Big(0),
      };
    }
  };

  const formatList = async (_list: Trend[] = []) => {
    _list = Array.isArray(_list) ? _list : [];
    for (let i = 0; i < _list.length; i++) {
      const it = _list[i];
      it.created2Now = timeAgo(new Date(it.project_created).getTime(), new Date().getTime());
      const { poolAmount, solAmount } = await getPoolToken(it);
      let _progress = Big(1095840542120770).minus(poolAmount).div(Big(1095840542120770).minus(295840542120770)).times(100);
      if (Big(_progress).lt(0)) {
        _progress = Big(0);
      }
      if (Big(_progress).gt(100)) {
        _progress = Big(100);
      }
      it.progress = _progress.toFixed(2);
      it.poolAmount = poolAmount;
      it.solAmount = solAmount;
    }
    return _list;
  };

  const getList = async (params: { limit: number; offset?: number; search?: string; order?: 'desc' | 'asc' | ''; }) => {
    try {
      const res = await httpGet(`/project/trends/list`, {
        limit: params.limit,
        offset: params.offset ?? 0,
        text: params.search,
        order: params.order?.toUpperCase?.() ?? '',
      });
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
    const _top1 = res.list[0];
    // calc market cap trends
    if (_top1) {
      _top1.marketCapTrendsDirection = '+';
      _top1.marketCapTrends = '0.00';
      _top1.holder = 0;
      const _top1Meta = await getTokenMeta(_top1.address);
      if (_top1Meta.success && _top1Meta.data?.holder) {
        _top1.holder = _top1Meta.data?.holder;
      }
    }
    if (_top1 && _top1.poolAmount && Big(_top1.poolAmount).gt(0)) {
      const tokenMintAddress = new PublicKey(_top1.address);
      const tokenSupplyInfo = await connection.getTokenSupply(tokenMintAddress);
      const uiAmount = tokenSupplyInfo.value.uiAmount;
      const prevMarketCap = Big(_top1.solAmount ?? 0)
        .div(10 ** 9)
        .mul(10 ** _top1.token_decimals)
        .mul(config.SolPrice ?? 0)
        .div(_top1.poolAmount ?? 0)
        .mul(uiAmount || total_supply)
      const diffMarketCap = Big(_top1.market_cap).minus(prevMarketCap);
      if (!Big(prevMarketCap).eq(0)) {
        const _marketCapTrends = Big(diffMarketCap).div(prevMarketCap).times(100);
        _top1.marketCapTrends = _marketCapTrends.toFixed(2);
        if (_marketCapTrends.lt(0)) {
          _top1.marketCapTrendsDirection = '-';
        }
      }
    }
    setTop1(_top1);
    setTop1Loading(false);
  };

  const getHottestList = async () => {
    setHottestListLoading(true);
    const res = await getList({ limit: 7, search: '' });
    setHottestList(res.list.slice(1, 7));
    setHottestListLoading(false);
  };

  const getTableList = async (params: { pageIndex: number; searchText?: string; orderBy?: 'desc' | 'asc' | '' }) => {
    setTableListLoading(true);
    const { pageIndex } = params;
    const res = await getList({
      limit: 20,
      offset: pageIndex,
      search: params.searchText ?? searchText,
      order: params.orderBy ?? orderBy['market_cap'] ?? '',
    });
    if (pageIndex === 0) {
      setTableList(res.list);
    } else {
      setTableList([...tableList, ...res.list]);
    }
    setTableListPageMore(res.hasMore);
    setTableListPageIndex(pageIndex + 1);
    setTableListLoading(false);
  };

  const { run: getTableListDelay, cancel: getTableListCancel } = useDebounceFn((params) => {
    getTableList(params);
  }, { wait: 1000 });

  const handleCurrentFilter = (_currentFilter: number) => {
    if (_currentFilter === currentFilter || tableListLoading) return;
    setCurrentFilter(_currentFilter);
    getTableListDelay({ pageIndex: 0 });
  };

  const handleOrderBy = (key: string) => {
    if (tableListLoading) return;
    if (orderBy[key] === 'asc') {
      setOrderBy({ [key]: 'desc' });
      getTableListDelay({ pageIndex: 0, orderBy: 'desc' });
      return;
    }
    if (orderBy[key] === 'desc') {
      setOrderBy({ [key]: '' });
      getTableListDelay({ pageIndex: 0, orderBy: '' });
      return;
    }
    setOrderBy({ [key]: 'asc' });
    getTableListDelay({ pageIndex: 0, orderBy: 'asc' });
  };

  const handleSearchText = (e: any) => {
    let val = e.target.value;
    val = trim(val);
    setSearchText(val);
    setTableListPageMore(true);
    getTableListDelay({
      pageIndex: 0,
      searchText: val,
    });
  };

  useEffect(() => {
    // console.log('isPollingTop1: %o', isPollingTop1);
    if (!isPollingTop1) return;
    const timer = setInterval(() => {
      getTop1();
    }, 60000);
    getTop1();

    return () => {
      clearInterval(timer);
    };
  }, [isPollingTop1]);

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
      setTableListPageMore(true);
      getTableListDelay({
        pageIndex: 0,
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
  poolAmount?: Big.Big;
  solAmount?: Big.Big;
  marketCapTrends?: string;
  marketCapTrendsDirection?: '+' | '-';
  holder?: number;
}

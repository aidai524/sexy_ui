import { useEffect, useMemo, useState } from 'react';
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

export function useTrends(props?: { isPolling?: boolean; }) {
  const { isPolling } = props ?? {};

  const {
    allList,
    allListLoading,
    setAllList,
    top1,
    tableList,
    hottestList,
    setTop1,
    setTableList,
    setHottestList,
    setAllListLoading,
  } = useTrendsStore();
  const { connection } = useConnection();
  const { config }: any = useConfig();

  const [currentFilter, setCurrentFilter] = useState<number>(1);
  const [orderBy, setOrderBy] = useState<Record<string, 'asc' | 'desc' | '' | undefined>>({});
  const [searchText, setSearchText] = useState<string>('');

  const currentTableList = useMemo(() => {
    let _tableList = tableList;
    if (searchText) {
      _tableList = tableList.filter((it) => {
        if (it.token_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) return true;
        if (it.token_symbol.toLowerCase().indexOf(searchText.toLowerCase()) > -1) return true;
        return false;
      });
    }
    return _tableList.sort((a, b) => {
      if (orderBy.market_cap) {
        const isAsc = orderBy.market_cap === 'asc';
        if (Big(a.market_cap || 0).gt(Big(b.market_cap || 0))) return isAsc ? 1 : -1;
        return isAsc ? -1 : 1;
      }
      return a.ranking - b.ranking;
    });
  }, [searchText, tableList, orderBy]);

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
        // console.log('%ctrends getPoolToken no pool, will return 0 amount', 'background:#FF2681;color:#fff;');
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
      // console.log(
      //   '%ctrends [%s] result: pool data=%o, pool token amount=%o, sol token amount=%o',
      //   'background:#FF2681;color:#fff;',
      //   token?.token_symbol,
      //   poolData,
      //   poolToken?.toString?.(),
      //   solToken?.toString?.(),
      // );
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

  const getAllList = async () => {
    setAllListLoading(true);
    try {
      const res = await httpGet(`/project/trends/list`, {
        // ⚠️ Trends page is no longer paginated, all data is returned at once
        // https://s3.cn-north-1.amazonaws.com.cn/lcpublic/185dc2d5-3cd5-40b5-9957-f1f95e47ca08_1200_8000?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAR4LOV33FDQFAFDV4%2F20250106%2Fcn-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250106T130658Z&X-Amz-Expires=10800&X-Amz-Signature=18fe496af343275074fcf0925e3f38102e99a5685e1be029f77b837a17a7490e&X-Amz-SignedHeaders=host&x-id=GetObject
        limit: 100,
        offset: 0,
        text: '',
        order: '',
      });
      const _all_list = await formatList(res.data.list);
      const _top1 = _all_list[0];
      const _hottestList = _all_list.slice(1, 7);
      const _tableList = _all_list.slice(7);
      if (_top1) {
        _top1.marketCapTrendsDirection = '+';
        _top1.marketCapTrends = '0.00';
        _top1.holder = 0;
        const _top1Meta = await getTokenMeta(_top1.address);
        if (_top1Meta.success && _top1Meta.data?.holder) {
          _top1.holder = _top1Meta.data?.holder;
        }
        if (_top1.poolAmount && Big(_top1.poolAmount).gt(0)) {
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
      }
      setTop1(_top1);
      setHottestList(_hottestList);
      setTableList(_tableList);
      setAllList(_all_list);
      setAllListLoading(false);
    } catch (err) {
      console.log('get trends list err: %o', err);
      setAllListLoading(false);
    }
  };

  const handleCurrentFilter = (_currentFilter: number) => {
    if (_currentFilter === currentFilter) return;
    setCurrentFilter(_currentFilter);
  };

  const handleOrderBy = (key: string) => {
    if (orderBy[key] === 'asc') {
      setOrderBy({ [key]: 'desc' });
      return;
    }
    if (orderBy[key] === 'desc') {
      setOrderBy({ [key]: '' });
      return;
    }
    setOrderBy({ [key]: 'asc' });
  };

  const handleSearchText = (e: any) => {
    let val = e.target.value;
    val = trim(val);
    setSearchText(val);
  };

  useEffect(() => {
    // console.log('isPollingTop1: %o', isPollingTop1);
    if (!isPolling) return;
    const timer = setInterval(() => {
      getAllList();
    }, 60000);
    getAllList();

    return () => {
      clearInterval(timer);
    };
  }, [isPolling]);

  return {
    allList,
    currentTableList,
    getAllList,
    top1,
    tableList,
    hottestList,
    allListLoading,

    currentFilter,
    handleCurrentFilter,
    orderBy,
    handleOrderBy,
    searchText,
    handleSearchText,
    handleSearchTextClear: () => {
      handleSearchText({ target: { value: '' } });
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
  creator_name: string;
  initiative_launching: boolean;

  // front-end attributes
  created2Now?: string;
  progress?: string;
  poolAmount?: Big.Big;
  solAmount?: Big.Big;
  marketCapTrends?: string;
  marketCapTrendsDirection?: '+' | '-';
  holder?: number;
}

import { useEffect, useMemo, useRef } from 'react';
import { httpGet, timeAgo } from '@/app/utils';
import { PublicKey } from '@solana/web3.js';
import { programId_address } from '@/app/utils/config';
import Big from 'big.js';
import { Program } from '@coral-xyz/anchor';
import idl from '@/app/hooks/meme_launchpad.json';
import { useConnection } from '@solana/wallet-adapter-react';
import { Hot, Meme, useMemesListStore } from '@/app/sections/memes/store/list';
import { MemesState, useMemesStore } from '@/app/sections/memes/store';
import { Order, TABS } from '@/app/sections/memes/config';
import { useThrottleFn } from 'ahooks';
import { fetchData, getGranularityByResolution } from '@/app/components/chart/fetch-data';

export function useMemes(props?: { isLoadData?: boolean; }): Memes {
  const { isLoadData } = props ?? {};

  const {
    hotList,
    hotListLoading,
    setHotList,
    setHotListLoading,
    memesGenesisList,
    memesImportList,
    memesListedList,
    memesTickingList,
    memesListLoading,
    memesListPageLimit,
    memesListPageNext,
    memesListPageOffset,
    setMemesListedList,
    setMemesTickingList,
    setMemesImportList,
    setMemesGenesisList,
    setMemesListLoading,
    setMemesListPageOffset,
    setMemesListPageNext,
  } = useMemesListStore();
  const {
    currentTab,
    setCurrentTab,
    prevTab,
    setPrevTab,
    currentFilter,
    setCurrentFilter,
  } = useMemesStore();
  const { connection } = useConnection();

  const memesContainerRef = useRef<any>();

  const _currentMemesList = (_type: string) => {
    if (_type === TABS[1].value) {
      return memesGenesisList;
    }
    if (_type === TABS[2].value) {
      return memesTickingList;
    }
    if (_type === TABS[3].value) {
      return memesListedList;
    }
    if (_type === TABS[4].value) {
      return memesImportList;
    }
    return [];
  };

  const listShown = useMemo<Hot[] | Meme[]>(() => {
    let _list: any = _currentMemesList(currentTab.value);
    if (currentTab.value === TABS[0].value) {
      _list = hotList;
      if (currentFilter) {
        _list = _list.sort((a: any, b: any) => {
          const aValue = Big(a[currentFilter.value]);
          const bValue = Big(b[currentFilter.value]);

          if (aValue.eq(bValue)) {
            const aSort = a.ranking || 0;
            const bSort = b.ranking || 0;
            return aSort - bSort;
          }

          if (currentFilter.order === Order.Asc) {
            return aValue.lt(bValue) ? -1 : 1;
          }
          return aValue.gt(bValue) ? -1 : 1;
        });
      }
    }
    return _list;
  }, [
    hotList,
    memesGenesisList,
    memesImportList,
    memesListedList,
    memesTickingList,
    currentTab,
    currentFilter,
    _currentMemesList
  ]);

  const getPoolToken = async (token: Hot) => {
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

  const formatHotList = async (_list: Hot[] = []) => {
    _list = Array.isArray(_list) ? _list : [];
    for (let i = 0; i < _list.length; i++) {
      const it = _list[i];
      it.kind = 'Hot';
      it.created2Now = timeAgo(new Date(it.project_created).getTime(), new Date().getTime());

      if ([0].includes(it.status)) {
        const { poolAmount, solAmount } = await getPoolToken(it);
        let _progress = Big(1095840542120770).minus(poolAmount).div(Big(1095840542120770).minus(295840542120770)).times(100);
        if (Big(_progress).lt(0)) {
          _progress = Big(0);
        }
        if (Big(_progress).gt(100)) {
          _progress = Big(100);
        }
        it.progress = _progress.toFixed(2, Big.roundDown);
        it.poolAmount = poolAmount;
        it.solAmount = solAmount;
      }

      // get k-line data
      if (![0].includes(it.status) && i < 3) {
        const kLineRes = await fetchData(
          it.address,
          getGranularityByResolution('1H'),
          0
        );
        it.kLineData = kLineRes.data.map(([timestamp, open]: any) => ({
          timestamp: timestamp,
          price: parseFloat(open),
        }));
      }
    }
    return _list;
  };

  const getHotList = async () => {
    setHotListLoading(true);
    try {
      const res = await httpGet(`/project/trends/list`, {
        // ⚠️ Trends page is no longer paginated, all data is returned at once
        // https://s3.cn-north-1.amazonaws.com.cn/lcpublic/185dc2d5-3cd5-40b5-9957-f1f95e47ca08_1200_8000?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAR4LOV33FDQFAFDV4%2F20250106%2Fcn-north-1%2Fs3%2Faws4_request&X-Amz-Date=20250106T130658Z&X-Amz-Expires=10800&X-Amz-Signature=18fe496af343275074fcf0925e3f38102e99a5685e1be029f77b837a17a7490e&X-Amz-SignedHeaders=host&x-id=GetObject
        limit: 100,
        offset: 0,
        text: '',
        order: '',
      });

      const _hot_list = await formatHotList(res.data.list);

      console.log('_hot_list', _hot_list);

      setHotList(_hot_list);
      setHotListLoading(false);
    } catch (err) {
      console.log('get hot list err: %o', err);
      setHotListLoading(false);
    }
  };

  const formatMemesList = async (_list: Meme[] = []) => {
    _list = Array.isArray(_list) ? _list : [];
    for (let i = 0; i < _list.length; i++) {
      const it = _list[i];
      it.kind = 'Meme';
      it.created2Now = timeAgo(it.DApp === "pump" ? it.time : it.created_at);
    }
    return _list;
  };

  const getMemesList = async (params?: MemesListParams) => {
    setMemesListLoading(true);
    const {
      offset = memesListPageOffset,
      order = currentFilter?.order,
      sort = currentFilter?.value,
      type = currentTab.value,
    } = params ?? {};
    try {
      const res = await httpGet(`/project/memes/list`, {
        limit: memesListPageLimit,
        offset,
        order,
        sort,
        type,
      });

      const _memes_list = await formatMemesList(res.data.list);

      const _setMemesList = (val: any) => {
        switch (type) {
          // Genesis
          case TABS[1].value:
            setMemesGenesisList(val);
            break;
          // Ticking
          case TABS[2].value:
            setMemesTickingList(val);
            break;
          // Listed
          case TABS[3].value:
            setMemesListedList(val);
            break;
          // Import
          case TABS[4].value:
            setMemesImportList(val);
            break;
          default:
            break;
        }
      };

      if (offset === 0) {
        _setMemesList(_memes_list);
      } else {
        const _list = [..._currentMemesList(type), ..._memes_list];
        _setMemesList(_list);
      }

      setMemesListPageNext(res.data.has_next_page);
      setMemesListPageOffset(offset);
      setMemesListLoading(false);
    } catch (err) {
      console.log('get memes list err: %o', err);
      setMemesListLoading(false);
    }
  };

  const { run: onMemesListNextPage } = useThrottleFn(() => {
    if (memesListLoading || !memesListPageNext) return;
    getMemesList({
      offset: memesListPageOffset + 1,
    });
  }, { wait: 1000 });

  const initMemesList = () => {
    setMemesGenesisList([]);
    setMemesTickingList([]);
    setMemesListedList([]);
    setMemesImportList([]);
    setMemesListPageNext(true);
    setMemesListPageOffset(0);
    setMemesListLoading(false);
  };

  useEffect(() => {
    if (!isLoadData) return;

    getHotList();
    getMemesList();
  }, [isLoadData]);

  return {
    hotList,
    list: listShown,
    getHotList,
    getMemesList,
    hotListLoading,
    memesListLoading,
    currentTab,
    setCurrentTab,
    prevTab,
    setPrevTab,
    currentFilter,
    setCurrentFilter,
    memesListPageNext,
    onMemesListNextPage,
    initMemesList,
    memesContainerRef
  };
}

interface MemesListParams { offset?: number; order?: Order; sort?: string; type?: string; }

export interface Memes extends MemesState {
  hotList: Hot[];
  list: Hot[] | Meme[];
  getHotList(): Promise<void>;
  getMemesList(params?: MemesListParams): Promise<void>;
  hotListLoading: boolean;
  memesListLoading: boolean;
  memesListPageNext: boolean;
  onMemesListNextPage: () => void;
  initMemesList: () => void;
  memesContainerRef: React.MutableRefObject<any>;
}

import { useEffect } from 'react';
import { httpGet, timeAgo } from '@/app/utils';
import { PublicKey } from '@solana/web3.js';
import { programId_address } from '@/app/utils/config';
import Big from 'big.js';
import { Program } from '@coral-xyz/anchor';
import idl from '@/app/hooks/meme_launchpad.json';
import { useConnection } from '@solana/wallet-adapter-react';
import { Meme, useMemesStore } from '@/app/sections/memes/store/meme';

export function useMemes(props?: { isPolling?: boolean; }): Memes {
  const { isPolling } = props ?? {};

  const {
    allList,
    allListLoading,
    setAllList,
    setAllListLoading,
  } = useMemesStore();
  const { connection } = useConnection();

  const getPoolToken = async (token: Meme) => {
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

  const formatList = async (_list: Meme[] = []) => {
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
      it.progress = _progress.toFixed(2, Big.roundDown);
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

      console.log('_all_list', _all_list);

      setAllList(_all_list);
      setAllListLoading(false);
    } catch (err) {
      console.log('get memes list err: %o', err);
      setAllListLoading(false);
    }
  };

  useEffect(() => {
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
    getAllList,
    allListLoading,
  };
}

export interface Memes {
  allList: Meme[];
  getAllList(): Promise<void>;
  allListLoading: boolean;
}

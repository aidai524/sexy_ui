import { useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { httpAuthGet, httpAuthPost } from '@/app/utils';
import { fail, success } from '@/app/utils/toast';
import { useReferStore } from '@/app/store/useRefer';

export function useAirdrop(props: any): Airdrop {
  const { onClose } = props;

  const search = useSearchParams();
  const referStore = useReferStore();
  const { publicKey } = useWallet();

  const airdrop = useMemo(() => {
    return search.get('airdrop');
  }, [search]);
  const inviter = useMemo(() => {
    return search.get('code');
  }, [search]);

  const [userData, setUserData] = useState<Record<string, any>>({});
  const [airdropData, setAirdropData] = useState<Record<string, any>>({});
  const [pointList, setPointList] = useState<Record<string, any>[]>([]);
  const [pointListPageIndex, setPointListPageIndex] = useState<number>(1);
  const [pointListPageMore, setPointListPageMore] = useState<boolean>(true);
  const [pointListLoading, setPointListLoading] = useState(false);

  const [claiming, setClaiming] = useState(false);
  const [binding, setBinding] = useState(false);
  const [connectVisible, setConnectVisible] = useState(false);
  const [morePointsVisible, setMorePointsVisible] = useState(false);

  const { connected } = useWallet();

  const handleClaim = async () => {
    if (!connected) {
      setConnectVisible(true);
      return;
    }
    if (claiming) return;
    setClaiming(true);
    setMorePointsVisible(true);
    const res = await httpAuthPost('/airdrop/account/points');
    if (res.code !== 0) {
      setClaiming(false);
      fail('Claim points failed');
      return;
    }
    success('Claim points successful');
    onClose?.();
    setClaiming(false);
  };

  const getList = async () => {
    if (!pointListPageMore) return;
    setPointListLoading(true);
    const res = await httpAuthGet('/airdrop/point/list', {
      limit: 10,
      offset: pointListPageIndex,
    });
    if (res.code !== 0) {
      setPointListLoading(false);
      return;
    }
    setPointListPageMore(res.data.has_next_page);
    if (res.data.has_next_page) {
      setPointListPageIndex(pointListPageIndex + 1);
    }
    const _pointList = pointList.slice();
    setPointList([..._pointList, ...res.data.list]);
    setPointListLoading(false);
  };

  const handleBind = async () => {
    if (binding) return;
    setBinding(true);
    const res = await httpAuthPost(`/airdrop/binding/code`, {
      code: airdrop,
    });
    if (res.code !== 0) {
      if (!referStore.bind) {
        fail(`Binding failed${res.message ? ': ' + res.message : ''}`);
      }
      setBinding(false);
      return;
    }
    success('Binding successful');
    referStore.setBind(true);
    setBinding(false);
  };

  const getUserData = async () => {
    const res = await httpAuthGet('/airdrop/account/level_points', {
      account: publicKey?.toString(),
    });
    if (res.code !== 0) {
      return;
    }
    setUserData(res.data);
  };

  const getAirdropData = async () => {
    const res = await httpAuthGet('/airdrop/data');
    if (res.code !== 0) {
      return;
    }
    setAirdropData(res.data);
  };

  return {
    airdrop,
    inviter,
    connectVisible,
    connected,
    handleClaim,
    setConnectVisible,
    pointList,
    pointListLoading,
    morePointsVisible,
    setMorePointsVisible,
    handleBind,
    getList,
    claiming,
    getUserData,
    userData,
    airdropData,
    getAirdropData,
    pointListPageMore,
    onClose,
  };
}

export interface Airdrop {
  airdrop?: string | null;
  inviter?: string | null;
  connectVisible: boolean;
  connected?: boolean;
  claiming: boolean;
  pointListPageMore: boolean;
  setConnectVisible: Dispatch<SetStateAction<boolean>>;
  pointList: Record<string, any>[];
  pointListLoading: boolean;
  morePointsVisible: boolean;
  setMorePointsVisible: Dispatch<SetStateAction<boolean>>;
  userData: Record<string, any>;
  airdropData: Record<string, any>;

  handleClaim(): Promise<void>;
  handleBind(): Promise<void>;
  getList(): Promise<void>;
  getUserData(): Promise<void>;
  getAirdropData(): Promise<void>;
  onClose?(): void;
}

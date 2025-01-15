'use client';

import AirdropModal from '@/app/components/airdrop/modal';
import { useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { useAirdropStore } from '@/app/store/use-airdrop';
import { useReferralStore } from '@/app/store/useReferral';
import { useAccount } from '@/app/hooks/useAccount';

const AirdropEntry = () => {
  const search = useSearchParams();
  const { setVisible: setAirdropVisible, setConnectVisible } = useAirdropStore();
  const { setReferral } = useReferralStore();
  const { address } = useAccount();

  const isAirdrop = useMemo(() => {
    if (!address) return false;
    if (!search.get("referral")) return false;
    if (address.toString() === search.get("referral")) return false;
    if (!Cookies.get("referral")) {
      console.log("referral saved: %o", search.get("referral"));
      Cookies.set("referral", search.get("referral") as string, { path: "/" });
      setReferral(search.get("referral") as string);
    }
    if (!search.get("airdrop")) return false;
    // not connected wallet
    if (!address) {
      setConnectVisible(true);
      return false;
    }
    setConnectVisible(false);
    return true;
  }, [search, address]);

  useEffect(() => {
    setAirdropVisible(isAirdrop);
  }, [isAirdrop]);

  return (
    <AirdropModal />
  );
};

export default AirdropEntry;

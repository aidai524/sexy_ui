import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useConfig } from "@/app/store/useConfig";
import { httpGet } from "@/app/utils";
import { useEffect, useMemo, useState } from 'react';
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { AuthProvider } from "@/app/context/auth";
import AirdropModal from '@/app/components/airdrop/modal';
import { useSearchParams } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Cookies from 'js-cookie';
import { useAirdropStore } from '@/app/store/use-airdrop';

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();
  const search = useSearchParams();
  const { publicKey } = useWallet();
  const { setVisible: setAirdropVisible } = useAirdropStore();

  const isAirdrop = useMemo(() => {
    if (!publicKey) return false;
    if (!search.get('referral')) return false;
    if (publicKey.toString() === search.get('referral')) return false;
    if (!Cookies.get('referral')) {
      console.log('referral saved: %o', search.get('referral'));
      Cookies.set('referral', search.get('referral') as string, { path: '/' });
    }
    if (!search.get('airdrop')) return false;
    return true;
  }, [search, publicKey]);

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 6
  });

  useEffect(() => {
    httpGet("/config").then((res) => {
      if (res.code === 0) {
        configStore.set({
          config: res.data
        });
      }
    });

    getConfig().then((stateData) => {
      setPrepaidDelayTime(stateData.prepaidWithdrawDelayTime.toNumber() * 1000);
    });
  }, []);

  useEffect(() => {
    setAirdropVisible(isAirdrop);
  }, [isAirdrop]);

  return (
    <AuthProvider>
      {isMobile ? <Mobile {...props} /> : <Laptop {...props} />}
      <AirdropModal />
    </AuthProvider>
  );
}

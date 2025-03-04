import React, { useContext, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";
import { useAuth } from "@/app/context/auth";
import { usePathname, useRouter } from "next/navigation";
import { useDebounceFn } from "ahooks";
import { useReferralStore } from '@/app/store/useReferral';
import { useUser } from '@/app/store/useUser';
import Cookies from 'js-cookie';

const AirdropContext = React.createContext<Partial<IAirdropContext>>({});

export const AirdropContextProvider: React.FC<any> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setReferral } = useReferralStore();
  const { setReferer } = useUser();

  const isTerms = ["/privacy-policy", "/terms-and-conditions"].includes(pathname);

  const [airdropUserData, setAirdropUserData] = useState<any>();
  const [airdropDataLoading, setAirdropDataLoading] = useState(true);

  const { run: goToInviteCodeDelay, cancel: goToInviteCodeDelayCancel } =
    useDebounceFn(
      () => {
        setAirdropDataLoading(false);
        if (["/invite-code", "/"].includes(pathname) || isTerms) return;
        router.replace("/invite-code");
      },
      { wait: 2000 }
    );

  const getAirdropData = async () => {
    setAirdropDataLoading(true);
    const res = await httpAuthGet("/airdrop/data");
    if (res.code !== 0) {
      setAirdropDataLoading(false);
      return;
    }
    setAirdropUserData(res.data);
    setReferral(res.data.referral_account);
    console.log("referral saved: %o", res.data.referral_account);
    Cookies.set("referral", res.data.referral_account, { path: "/" });
    setReferer(res.data.allow_login);
    if (!res.data?.allow_login && !isTerms && !["/invite-code", "/"].includes(pathname)) {
      router.replace("/invite-code");
    }
    setAirdropDataLoading(false);
  };

  const { address } = useAccount();
  const { accountRefresher } = useAuth();

  useEffect(() => {
    goToInviteCodeDelayCancel();
    if (!address || !accountRefresher) {
      setAirdropUserData(void 0);
      goToInviteCodeDelay();
      return;
    }
    getAirdropData();
  }, [address, accountRefresher, pathname]);

  return (
    <AirdropContext.Provider
      value={{
        airdropUserData,
        airdropDataLoading
      }}
    >
      {children}
    </AirdropContext.Provider>
  );
};

export function useAirdropContext() {
  return useContext(AirdropContext);
}

interface IAirdropContext {
  airdropUserData: {
    referral_account: string;
    airdrop_points: string;
    clime_create: boolean;
    clime_pump: boolean;
    invited: number;
    points: string;
    referral_points: string;
    allow_login: boolean;
  };
  airdropDataLoading: boolean;
}

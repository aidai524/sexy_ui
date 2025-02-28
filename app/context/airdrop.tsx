import React, { useContext, useEffect, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";
import { useAuth } from "@/app/context/auth";
import { usePathname, useRouter } from "next/navigation";
import { useDebounceFn } from "ahooks";

const AirdropContext = React.createContext<Partial<IAirdropContext>>({});

export const AirdropContextProvider: React.FC<any> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [airdropUserData, setAirdropUserData] = useState<any>();
  const [airdropDataLoading, setAirdropDataLoading] = useState(true);

  const { run: goToInviteCodeDelay, cancel: goToInviteCodeDelayCancel } =
    useDebounceFn(
      () => {
        setAirdropDataLoading(false);
        if (pathname === "/invite-code") return;
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
    if (!res.data?.allow_login) {
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

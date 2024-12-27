import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { redirect } from "next/navigation";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";

import { useConfig } from "@/app/store/useConfig";
import { httpGet } from "@/app/utils";
import { useEffect, useCallback, useState } from "react";
import useNotice from "../../hooks/use-notice";
import {
  getAuthorizationByLocalAndServer,
  initAuthorization
} from "@/app/utils";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { useSearchParams, usePathname } from "next/navigation";
import { useCodeStore, CODE } from "../../store/use-code";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address, walletProvider } = useAccount();
  const userStore: any = useUser();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const searchParams = useSearchParams();
  const codeStore: any = useCodeStore();
  const pathname = usePathname();

  if (codeStore.a !== CODE && pathname !== "/") {
    redirect("/");
  }

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 6
  });

  useNotice();

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });

      setShowLoginModal(false);
    }
  }, [userInfo, address]);

  useEffect(() => {
    if (searchParams.get("a") === CODE) {
      codeStore.set();
    }
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

  const initToken = useCallback(async () => {
    const auth = await getAuthorizationByLocalAndServer();
    if (!auth) {
      initAuthorization();
    }
  }, [address]);

  useEffect(() => {
    if (!address) {
      return;
    }

    // @ts-ignore
    window.walletProvider = walletProvider;
    // @ts-ignore
    window.sexAddress = address;

    initToken();
  }, [address]);

  useEffect(() => {
    // @ts-ignore
    window.connect = () => {
      setShowLoginModal(true);
    };
  }, []);

  return isMobile ? (
    <Mobile
      {...props}
      {...{
        showLoginModal,
        setShowLoginModal
      }}
    />
  ) : (
    <Laptop
      {...props}
      {...{
        userInfo,
        address,
        onQueryInfo,
        showLoginModal,
        setShowLoginModal
      }}
    />
  );
}

import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
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

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address, walletProvider } = useAccount();
  const userStore: any = useUser();
  const configStore: any = useConfig()
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore()
  const { userInfo, onQueryInfo } = useUserInfo(address);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 2
  });

  useNotice();

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });

      setShowLoginModal(false)
    }
  }, [userInfo, address]);

  useEffect(() => {
    httpGet('/config').then(res => {
      if (res.code === 0) {
        configStore.set({
          config: res.data
        })
      }
    })
  }, [])

  useEffect(() => {
    getConfig().then((stateData) => {
      setPrepaidDelayTime(
        stateData.prepaidWithdrawDelayTime.toNumber() * 1000
      );
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

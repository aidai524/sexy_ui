import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect, useCallback, useState } from "react";
import useNotice from "../../hooks/use-notice";
import {
  getAuthorizationByLocalAndServer,
  initAuthorization
} from "@/app/utils";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address, walletProvider } = useAccount();
  const userStore: any = useUser();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  const [showLoginModal, setShowLoginModal] = useState(false);
  useNotice();

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });
    }
  }, [userInfo, address]);

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

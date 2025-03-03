import React, { useContext, useEffect, useState, useCallback } from "react";
import { useDebounceFn } from "ahooks";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@/app/hooks/use-wallet";
import { logOut } from "@/app/utils";
import LoginModal from "@/app/components/loginModal";
import SignatureModal from "../components/signature-modal";
import type { ReactNode } from "react";
import { useShare } from "../hooks/use-share";

const AuthContext = React.createContext<any | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { disconnect } = useWallet();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { address, walletProvider } = useAccount();
  const userStore: any = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  useShare();
  const [accountRefresher, setAccountRefresher] = useState(0);
  const { onQueryInfo, setUserInfo, fecthUserInfo } = useUserInfo(
    address,
    true,
    0
  );

  const { run: updateAccount } = useDebounceFn(
    async () => {
      window.walletProvider = walletProvider;
      window.sexAddress = address;

      if (address === userStore.userInfo?.address) {
        setAccountRefresher(1);
        updateCurrentUserInfo();
        return;
      }

      setShowSignatureModal(true);
    },
    { wait: 800 }
  );

  useEffect(() => {
    window.connect = () => {
      if (["/invite-code"].includes(pathname)) {
        setShowLoginModal(false);
        return;
      }
      setShowLoginModal(true);
    };
    window.disconnect = disconnect;
  }, [pathname]);

  const logout = useCallback(
    async (isRedirect?: boolean) => {
      await disconnect?.();
      // @ts-ignore
      setUserInfo(undefined);
      userStore.set({
        userInfo: null
      });
      logOut();
      // fix#REF-9292
      isRedirect && router.replace("/");
    },
    [address]
  );

  const updateCurrentUserInfo = useCallback(async () => {
    if (!address) return;
    const userInfo = await fecthUserInfo(address);
    userStore.set({ userInfo });
  }, [address]);

  useEffect(() => {
    if (!address) {
      setAccountRefresher(0);
      setTimeout(() => {
        if (!window.sexAddress) {
          logout();
        }
      }, 5000);
      return;
    }

    updateAccount();
  }, [address]);

  return (
    <AuthContext.Provider
      value={{
        userInfo: userStore.userInfo,
        address,
        pathname,
        accountRefresher,
        onQueryInfo,
        logout,
        updateCurrentUserInfo,
        updateUserLikeNum(num: number) {
          userStore.set({
            userInfo: { ...userStore.userInfo, using_like_num: num }
          });
        }
      }}
    >
      {children}
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
        }}
      />
      <SignatureModal
        {...{
          showSignatureModal,
          updateCurrentUserInfo,
          setAccountRefresher,
          setShowSignatureModal,
          accountRefresher
        }}
      />
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("");
  }

  return context;
}

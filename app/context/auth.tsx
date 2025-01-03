import React, { useContext, useEffect, useState, useCallback } from "react";
import { useDebounceFn } from "ahooks";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { usePathname, useSearchParams } from "next/navigation";
import { useCodeStore, CODE } from "@/app/store/use-code";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import {
  getAuthorizationByLocalAndServer,
  initAuthorization,
  logOut
} from "@/app/utils";
import LoginModal from "@/app/components/loginModal";
import type { ReactNode } from "react";

const AuthContext = React.createContext<any | null>(null);

export const AuthProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { disconnect } = useWallet();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { address, walletProvider } = useAccount();
  const userStore: any = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const codeStore: any = useCodeStore();
  const [accountRefresher, setAccountRefresher] = useState(0);
  const { userInfo, onQueryInfo, setUserInfo, fecthUserInfo } = useUserInfo(
    address,
    true,
    accountRefresher
  );

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });

      setShowLoginModal(false);
    }
  }, [userInfo, address]);

  const { run: updateAccount } = useDebounceFn(
    async () => {
      // @ts-ignore
      window.walletProvider = walletProvider;
      // @ts-ignore
      window.sexAddress = address;
      if (address === userStore.userInfo?.address) {
        setAccountRefresher(1);
        updateCurrentUserInfo();
        return;
      }
      await initAuthorization();
      setAccountRefresher(accountRefresher + 1);
    },
    { wait: 500 }
  );

  useEffect(() => {
    if (searchParams.get("a") === CODE) {
      codeStore.set();
    }
    // @ts-ignore
    window.connect = () => {
      setShowLoginModal(true);
    };
  }, []);

  const logout = useCallback(async () => {
    await disconnect?.();
    setUserInfo(undefined);
    userStore.set({
      userInfo: null
    });
    logOut();
  }, [address]);

  const updateCurrentUserInfo = useCallback(async () => {
    if (!address) return;
    const userInfo = await fecthUserInfo(address);
    userStore.set({ userInfo });
  }, [address]);

  useEffect(() => {
    if (!address) {
      setAccountRefresher(0);

      return;
    }
    updateAccount();
  }, [address]);

  if (codeStore.a !== CODE && pathname !== "/") {
    if (!process.env.NEXT_PUBLIC_BEN_DEV) {
      redirect("/");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userInfo: userStore.userInfo,
        address,
        pathname,
        accountRefresher,
        onQueryInfo,
        logout,
        updateCurrentUserInfo
      }}
    >
      {children}
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
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

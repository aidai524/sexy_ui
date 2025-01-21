import React, { useContext, useEffect, useState, useCallback } from "react";
import { useDebounceFn } from "ahooks";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCodeStore, CODE } from "@/app/store/use-code";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import { initAuthorization, logOut } from "@/app/utils";
import LoginModal from "@/app/components/loginModal";
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
  const searchParams = useSearchParams();
  const codeStore: any = useCodeStore();
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

      await initAuthorization();
      await updateCurrentUserInfo();
      setAccountRefresher(accountRefresher + 1);
    },
    { wait: 800 }
  );

  useEffect(() => {
    if (searchParams.get("a") === CODE) {
      codeStore.set();
    }
    window.connect = () => {
      setShowLoginModal(true);
    };
    window.disconnect = disconnect;
  }, []);

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

  const { run: runJump } = useDebounceFn(
    async () => {
      if (codeStore.a !== CODE && pathname !== "/") {
        !process.env.NEXT_PUBLIC_BEN_DEV && router.replace("/");
      }
    },
    { wait: 800 }
  );

  useEffect(() => {
    runJump();
  }, [codeStore.a, pathname, redirect]);
  

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

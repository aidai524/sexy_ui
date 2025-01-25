'use client';

import {
  ConnectedSolanaWallet,
  PrivyProvider,
  useLoginWithEmail,
  usePrivy,
  useSolanaWallets,
} from '@privy-io/react-auth';
import {toSolanaWalletConnectors} from '@privy-io/react-auth/solana';
import React, { MouseEvent, useContext, useEffect, useMemo, useState } from 'react';
import { fail } from '@/app/utils/toast';

const solanaConnectors = toSolanaWalletConnectors();

interface IPrivyWalletContext {
  wallet: ConnectedSolanaWallet;
  creatingWallet: boolean;
  setCreatingWallet: React.Dispatch<React.SetStateAction<boolean>>;
  disconnect: () => Promise<void>;
}

export const PrivyWalletContext = React.createContext<Partial<IPrivyWalletContext>>({});

function PrivyWalletProvider(props: { children: React.ReactNode; }) {
  const { children } = props;

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        loginMethods: ['email'],
        appearance: {
          walletChainType: 'solana-only',
        },
        externalWallets: {
          solana: {connectors: solanaConnectors}
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <CreatePrivyWallet>
        {children}
      </CreatePrivyWallet>
    </PrivyProvider>
  );
}

export default PrivyWalletProvider;

function CreatePrivyWallet(props: any) {
  const { children } = props;

  const [creatingWallet, setCreatingWallet] = useState<boolean>(false);
  const { authenticated, user, logout } = usePrivy();
  const { state } = useLoginWithEmail();
  const { ready, wallets: solanaWallets, createWallet } = useSolanaWallets();

  const wallet = useMemo(() => {
    return solanaWallets.find((it) => it.connectorType === 'embedded' && it.type === 'solana' && it.walletClientType === 'privy');
  }, [solanaWallets]);

  console.log('%c>>>>> privy wallet: %o', 'background:#fbca04;color:#fff;', wallet);

  useEffect(() => {
    console.log('%c>>>>> authenticated: %o', 'background:#fbca04;color:#fff;', authenticated);
    console.log('%c>>>>> user: %o', 'background:#fbca04;color:#fff;', user);
    console.log('%c>>>>> creatingWallet: %o', 'background:#fbca04;color:#fff;', creatingWallet);
    if (!authenticated) return;
    if (!user) return;
    if (creatingWallet) return;
    // created embedded wallet
    const hadEmbeddedWallet = user.linkedAccounts?.some?.((it) => {
      return it.type === 'wallet' && it.chainType === 'solana' && it.walletClientType === 'privy';
    });
    console.log('%c>>>>> hadEmbeddedWallet: %o', 'background:#fbca04;color:#fff;', hadEmbeddedWallet);
    if (hadEmbeddedWallet) return;
    console.log('>>>>> creating wallet...');
    setCreatingWallet?.(true);
    createWallet?.().then((wallet) => {
      console.log('>>>>>> wallet: %o', wallet);
    }).catch((err) => {
      console.log(err);
      fail('Create wallet failed' + (err?.message ? ': ' + err.message : ''), { maskStyle: { zIndex: 2000 } });
    }).finally(() => {
      setCreatingWallet?.(false);
    });
  }, [authenticated, user, creatingWallet]);

  return (
    <PrivyWalletContext.Provider
      value={{
        wallet,
        creatingWallet,
        setCreatingWallet,
        disconnect: async () => {
          await logout();
          const privyEmbeddedWallet = solanaWallets.find((it) => it.walletClientType === 'privy');
          privyEmbeddedWallet?.disconnect?.();
        },
      }}
    >
      {children}
    </PrivyWalletContext.Provider>
  );
}

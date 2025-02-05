import { useWallet as useAdapterWallet } from "@solana/wallet-adapter-react";
import { usePrivy } from '@privy-io/react-auth';
import { useContext } from 'react';
import { PrivyWalletContext } from '@/app/context/privy';
import { PublicKey } from '@solana/web3.js';

export function useWallet() {
  const adapterWallet = useAdapterWallet();
  const { authenticated } = usePrivy();
  const { wallet: privyWallet, disconnect: privyDisconnect } = useContext(PrivyWalletContext);

  if (authenticated && privyWallet?.address) {
    const privyPublicKey = new PublicKey(privyWallet.address);

    return {
      autoConnect: true,
      wallets: [privyWallet],
      wallet: privyWallet,
      publicKey: privyPublicKey,
      connecting: false,
      connected: true,
      disconnecting: false,

      select: () => {},
      connect: () => {},
      disconnect: privyDisconnect,

      sendTransaction: privyWallet.sendTransaction,
      signTransaction: privyWallet.signTransaction,
      signAllTransactions: () => {},
      signMessage: privyWallet.signMessage,
      signIn: () => {},
    };
  }

  return adapterWallet;
}

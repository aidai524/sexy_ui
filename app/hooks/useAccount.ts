import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export function useAccount() {
  const { connected, connecting, publicKey, signTransaction, sendTransaction, signMessage } = useWallet();
  const { connection } = useConnection();

  return {
    connected,
    connecting,
    address: publicKey?.toString(),
    walletProvider: {
      publicKey,
      signAndSendTransaction: async (transaction: any, signers?: any) => {
        const signTransition = await signTransaction?.(transaction);
        const tx = await connection.sendTransaction(signTransition, signers);
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();
        return connection.confirmTransaction({
          blockhash: blockhash,
          lastValidBlockHeight: lastValidBlockHeight,
          signature: tx,
        });
      },
      signMessage
    },
  };
}

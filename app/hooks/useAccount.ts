import bs58 from 'bs58';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignAndSendTransaction, SolanaSignMessage, SolanaSignTransaction } from '@solana/wallet-standard-features';



export function useAccount() {
  const { connected, connecting, disconnect, publicKey, signTransaction, sendTransaction, signMessage, wallet, connect } = useWallet();
  const { connection } = useConnection();

  return {
    connected,
    connecting,
    connect,
    disconnect,
    address: publicKey?.toString(),
    publicKey,
    walletProvider: {
      publicKey,
      signAndSendTransaction: async (transaction: any, sendOptions: any = {}) => {
        // @ts-ignore
        if (wallet?.adapter && wallet.adapter.wallet) {
          // @ts-ignore
          const walletProvider = wallet.adapter.wallet
          const feature = walletProvider.features[SolanaSignAndSendTransaction];
          const account = walletProvider.accounts[0];
          const [result] = await feature.signAndSendTransaction({
            account,
            transaction: transaction.serialize({ verifySignatures: false }),
            options: {
              ...sendOptions,
              // preflightCommitment: getCommitment(sendOptions?.preflightCommitment)
            },
            chain: 'solana:devnet'
          });

          return bs58.encode(result.signature)
        }


      },
      signMessage
    },
  };
}

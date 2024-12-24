import bs58 from 'bs58';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignAndSendTransaction, SolanaSignMessage, SolanaSignTransaction } from '@solana/wallet-standard-features';
import * as anchor from "@coral-xyz/anchor";
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

        // const payer = anchor.web3.Keypair.fromSecretKey(new Uint8Array([3,225,47,235,189,179,184,213,80,170,179,221,146,156,35,224,166,113,184,43,72,200,116,4,143,2,141,198,78,195,237,2,217,215,191,79,17,246,118,64,166,130,236,208,49,120,162,168,164,67,144,22,71,199,70,108,15,204,57,54,202,27,192,207]));
        // // const payer = anchor.web3.Keypair.fromSecretKey(bs58.decode('4kRBMPsH3Wk3TWoU8vftTND7qQJDJsJQ9tYYMNu2TEegSngJ29xbx6g6SfgJvoHNLnYJ5S3qhXnVzpJ3cygndQHg'))
        // // // console.log('payer:', payer)

        // console.log('transaction:', transaction)

        // const signTransition = await signTransaction?.(transaction);

        // console.log('signTransition:', signTransition)

        // const tx = await connection.sendTransaction(signTransition, [payer], sendOptions);
        // const {
        //   context: { slot: minContextSlot },
        //   value: { blockhash, lastValidBlockHeight }
        // } = await connection.getLatestBlockhashAndContext();

        // return connection.confirmTransaction({
        //   blockhash: blockhash,
        //   lastValidBlockHeight: lastValidBlockHeight,
        //   signature: tx,
        // });



        // @ts-ignore
        if (wallet?.adapter && wallet.adapter.wallet) {
          // @ts-ignore
          const walletProvider = wallet.adapter.wallet
          const feature = walletProvider.features[SolanaSignAndSendTransaction];
          const account = walletProvider.accounts[0];

          console.log(sendOptions, account)

          const [result] = await feature.signAndSendTransaction({
            account,
            transaction: transaction.serialize({ verifySignatures: false }),
            options: {
              ...sendOptions,
              // preflightCommitment: getCommitment(sendOptions?.preflightCommitment)
            },
            chain: 'solana:devnet'
          });

          const tx = bs58.encode(result.signature)

          console.log('tx:', tx)

          const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
          } = await connection.getLatestBlockhashAndContext();


          console.log('blockhash:', blockhash)

          const confirmRes = await connection.confirmTransaction({
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signature: tx,
          });

          console.log('confirmRes:', confirmRes)

          return tx


        }

        return null

      },
      signMessage
    },
  };
}

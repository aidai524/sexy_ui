import bs58 from 'bs58';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignAndSendTransaction, SolanaSignMessage, SolanaSignTransaction } from '@solana/wallet-standard-features';
import * as anchor from "@coral-xyz/anchor";
import { sleep } from '../utils';

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
        // const payer = anchor.web3.Keypair.fromSecretKey(new Uint8Array([139,58,49,231,16,74,81,168,165,73,79,141,80,247,219,118,65,238,234,181,151,37,135,189,207,216,14,13,212,240,197,56,147,86,29,15,151,60,160,94,100,213,216,240,153,18,203,243,253,40,8,28,180,193,189,133,138,245,188,35,234,115,22,55]));
        // const payer = anchor.web3.Keypair.fromSecretKey(bs58.decode('4kRBMPsH3Wk3TWoU8vftTND7qQJDJsJQ9tYYMNu2TEegSngJ29xbx6g6SfgJvoHNLnYJ5S3qhXnVzpJ3cygndQHg'))


        const latestBlockhash = await connection?.getLatestBlockhash();
        // console.log('transaction:', transaction)
        transaction.feePayer = publicKey
        transaction.recentBlockhash = latestBlockhash!.blockhash

        // const signTransition = await signTransaction?.(transaction);
        // console.log('signTransition:', signTransition)

        const confirmationStrategy: any = {
          skipPreflight: true,
          maxRetries: 10,
          preflightCommitment: 'finalized',
        };

        // const x = signTransition.serialize()

        // console.log('x', x)
        
        console.log(transaction, 'transaction')

        const tx = await sendTransaction(transaction, connection, {
          ...confirmationStrategy,
          ...sendOptions,
        });

        // alert(tx)
        // const tx = await connection.sendTransaction(transaction, [payer], {
        //   ...confirmationStrategy,
        //   ...sendOptions,
        // });
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const startTime = Date.now();
        const timeout = 120000
        let done = false;
        let status

        while(!done && Date.now() - startTime < timeout) {
          status = await connection.getSignatureStatus(tx, {
            searchTransactionHistory: true,
          });
          if (status?.value?.confirmationStatus === 'finalized' || status?.value?.err) {
            done = true;
          } else {
            await sleep(1000);
          }
        }

        if (!status) {
          throw new Error(`Transaction confirmation failed for signature ${tx}`);
        }

        if (!status.value || status.value?.err) {
          throw new Error(
            status.value?.err
              ? `send transaction failed: ${
                  typeof status.value.err === 'string'
                    ? status.value.err
                    : JSON.stringify(status.value.err)
                }`
              : `send transaction failed, please try again later`,
          );
        }

        // try {
        //   const confirmRes = await connection.confirmTransaction({
        //     blockhash: blockhash,
        //     lastValidBlockHeight: lastValidBlockHeight,
        //     signature: tx,
        //   });

        //   alert(JSON.stringify(confirmRes))

        //   if (confirmRes.value.err) {
        //     return null
        //   }

        //   alert(tx)
  
        // } catch(e) {
        //   alert(e)
        // }

        return tx

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
            chain: 'solana:mainnet'
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

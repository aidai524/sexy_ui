import bs58 from 'bs58';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SolanaSignAndSendTransaction, SolanaSignMessage, SolanaSignTransaction } from '@solana/wallet-standard-features';
import * as anchor from "@coral-xyz/anchor";
import { sleep } from '../utils';
import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';
import Big from 'big.js';

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

        const microLamports = await getPriorityFeeEstimate(transaction, connection.rpcEndpoint)

        transaction.add(
          ComputeBudgetProgram.setComputeUnitLimit({
            units: 500000,
          }),
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: microLamports,
          }),
        );

        // const signTransition = await signTransaction?.(transaction);
        // console.log('signTransition:', signTransition)

        const confirmationStrategy: any = {
          skipPreflight: true,
          maxRetries: 10,
          preflightCommitment: 'finalized',
        };

        // const x = signTransition.serialize()

        // console.log('x', x)
        
        // console.log(transaction, 'transaction')

        const tx = await sendTransaction(transaction, connection, {
          ...confirmationStrategy,
          ...sendOptions,
        });

        // console.log(tx)
        // const tx = await connection.sendTransaction(transaction, [payer], {
        //   ...confirmationStrategy,
        //   ...sendOptions,
        // });
        // const {
        //   context: { slot: minContextSlot },
        //   value: { blockhash, lastValidBlockHeight }
        // } = await connection.getLatestBlockhashAndContext();

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

        console.log('status:', status)

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

        return tx

      },
      signMessage
    },
  };
}


async function getPriorityFeeEstimate(transaction: Transaction, rpcEndpoint: string) {
  const defaultPriorityFee = 300000;
  const multiplier = 10;
  try {
    if (process.env.NEXT_PUBLIC_NETWORK !== 'mainnet') return defaultPriorityFee;

    const res = await fetch(rpcEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getPriorityFeeEstimate',
        params: [
          {
            transaction: bs58.encode(transaction.serialize({ verifySignatures: false })),
            options: { recommended: true },
          },
        ],
      }),
    }).then(res => res.json());
    const priorityFee = new Big(res?.result?.priorityFeeEstimate || 0)
      .mul(multiplier)
      .round(0)
      .toNumber();
    return Math.min(priorityFee ?? defaultPriorityFee, defaultPriorityFee);
  } catch (error) {
    console.error(error);
    return defaultPriorityFee;
  }
}
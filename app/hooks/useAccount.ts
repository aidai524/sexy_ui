import bs58 from "bs58";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { sleep } from "../utils";
import { ComputeBudgetProgram, PublicKey, Transaction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import Big from "big.js";

const lookupTableAddress = new PublicKey('2ATmQ41kVt7tpxWkyv82CGcVg6CWVWjp7GPuexoXTonR')

export function useAccount() {
  const {
    connected,
    connecting,
    disconnect,
    publicKey,
    signTransaction,
    sendTransaction,
    signMessage,
    wallet,
    connect
  } = useWallet();
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
      signAndSendTransaction: async (
        transaction: any,
        sendOptions: any = {},
        isVersionedTransaction: boolean = false
      ) => {
        const confirmationStrategy: any = {
          skipPreflight: true,
          maxRetries: 10,
          preflightCommitment: "finalized"
        };


        let _transaction: any = transaction

        if (!isVersionedTransaction) {
          const latestBlockhash = await connection?.getLatestBlockhash();
          transaction.feePayer = publicKey;
          transaction.recentBlockhash = latestBlockhash!.blockhash;

          const microLamports = await getPriorityFeeEstimate(
            transaction,
            connection.rpcEndpoint
          );

          // await fetchPriorityFeeEstimate(transaction)

          transaction.add(
            ComputeBudgetProgram.setComputeUnitLimit({
              units: 500000
            }),
            ComputeBudgetProgram.setComputeUnitPrice({
              microLamports: microLamports
            })
          );

          if (process.env.NEXT_PUBLIC_NET === 'Mainnet') {
            const lookupTableAccount = (
              await connection.getAddressLookupTable(lookupTableAddress)
            ).value;

            const message = new TransactionMessage({
              payerKey: publicKey!, // Public key of the account paying for the transaction
              recentBlockhash: latestBlockhash.blockhash, // Blockhash of the most recent block
              instructions: transaction.instructions, // Instructions to be included in the transaction
            }).compileToV0Message([lookupTableAccount!])


            const versionedTransaction = new VersionedTransaction(message)

            _transaction = versionedTransaction
          }

        }

        const tx = await sendTransaction(_transaction, connection, {
          ...confirmationStrategy,
          ...sendOptions
        });

        // console.log(tx)
        // const tx = await connection.sendTransaction(transaction, [payer], {
        //   ...confirmationStrategy,
        //   ...sendOptions,
        // });

        const startTime = Date.now();
        const timeout = 120000;
        let done = false;
        let status;

        if (isVersionedTransaction) {
          while (!done && Date.now() - startTime < timeout) {
            const transactionDetails = await connection.getTransaction(tx, {
              maxSupportedTransactionVersion: 0
            });

            if (transactionDetails && !transactionDetails.meta?.err) {
              done = true;
            } else {
              await sleep(1000);
            }
          }

          if (!done) {
            throw new Error(`send transaction failed, please try again later`);
          }
        } else {
          while (!done && Date.now() - startTime < timeout) {
            status = await connection.getSignatureStatus(tx, {
              searchTransactionHistory: true
            });

            if (
              status?.value?.confirmationStatus === "finalized" ||
              status?.value?.err
            ) {
              done = true;
            } else {
              await sleep(1000);
            }
          }

          if (!status) {
            throw new Error(
              `Transaction confirmation failed for signature ${tx}`
            );
          }

          if (!status.value || status.value?.err) {
            throw new Error(
              status.value?.err
                ? `send transaction failed: ${typeof status.value.err === "string"
                  ? status.value.err
                  : JSON.stringify(status.value.err)
                }`
                : `send transaction failed, please try again later`
            );
          }
        }

        return tx;
      },
      signMessage
    }
  };
}

async function getPriorityFeeEstimate(
  transaction: Transaction,
  rpcEndpoint: string
) {
  const defaultPriorityFee = 300000;
  const multiplier = 10;
  try {
    if (process.env.NEXT_PUBLIC_NET !== "Mainnet")
      return defaultPriorityFee;

    const res = await fetch(rpcEndpoint, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: bs58.encode(
              transaction.serialize({ verifySignatures: false })
            ),
            options: { recommended: true }
          }
        ]
      })
    }).then((res) => res.json());
    const priorityFee = new Big(res?.result?.priorityFeeEstimate || 0)
      .mul(multiplier)
      .round(0)
      .toNumber();

    console.log('priorityFee:', priorityFee)

    return Math.min(priorityFee ?? defaultPriorityFee, defaultPriorityFee);
  } catch (error) {
    console.error(error);
    return defaultPriorityFee;
  }
}


const fetchPriorityFeeEstimate = async (transaction: Transaction) => {
  const heliusRpcUrl = "https://mainnet.helius-rpc.com/?api-key=88a744d8-9b40-4c38-bb22-5ff967f522a3";

  const requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getPriorityFeeEstimate",
    params: [
      {
        transaction: bs58.encode(
          transaction.serialize({ verifySignatures: false })
        ),
      }
    ]
  };

  try {
    const response = await fetch(heliusRpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log("Priority Fee Estimate:", data.result);
  } catch (error) {
    console.error("Error fetching priority fee estimate:", error);
  }
};

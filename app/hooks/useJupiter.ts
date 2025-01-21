import {
  PublicKey,
  Connection,
  Keypair,
  VersionedTransaction,
  VersionedMessage,
  TransactionMessage,
  Transaction
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { useAccount } from "./useAccount";
import { useCallback, useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";

import * as anchor from "@coral-xyz/anchor";

interface Params {
  tokenAddress: string | undefined;
}

const API_PREFIX = "https://quote-api.jup.ag";
const wsol = "So11111111111111111111111111111111111111112";

export default function useJupiter({ tokenAddress }: Params) {
  const { connection } = useConnection();
  const { publicKey, walletProvider } = useAccount();
  const [qoute, setQoute] = useState(1);

  useEffect(() => {
    if (tokenAddress) {
      fetch(`https://api.jup.ag/price/v2?vsToken=${wsol}&ids=${tokenAddress}`)
        .then((res) => res.json())
        .then((data: any) => {
          if (data[wsol] && data[tokenAddress]) {
            setQoute(
              Number(data[wsol].price) / Number(data[tokenAddress].price)
            );
          }
        });
    }
  }, [tokenAddress]);

  const getQoute = useCallback(
    async (amount: string, type: "buy" | "sell" = "buy", slip: number) => {
      if (tokenAddress) {
        const inputToken = type === "buy" ? wsol : tokenAddress;
        const outToken = type === "buy" ? tokenAddress : wsol;
        const swapInfo = await fetchSwapInfo(inputToken, outToken, amount, 0);

        console.log("swapInfo:", swapInfo);

        return swapInfo;
      }
      return null;
    },
    [tokenAddress]
  );

  const trade = useCallback(
    async (amount: string, type: "buy" | "sell" = "buy", slip: number) => {
      if (publicKey && tokenAddress && amount) {
        const swapInfo = await getQoute(amount, type, slip);

        const { swapTransaction, lastValidBlockHeight } =
          await fetchSwapTransaction(publicKey.toBase58(), slip, swapInfo);

        const vTransaction: any = VersionedTransaction.deserialize(
          Buffer.from(swapTransaction, "base64")
        );

        const hash = await walletProvider.signAndSendTransaction(
          vTransaction,
          {},
          true
        );

        console.log("hash", hash);

        return hash;
      }
    },
    [publicKey, walletProvider]
  );

  return {
    trade,
    getQoute,
    qoute
  };
}

// Step 1: Fetch swap info
async function fetchSwapInfo(
  inputMint: string,
  outputMint: string,
  amount: string,
  slip: number
) {
  const response = await fetch(
    `${API_PREFIX}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slip}&swapMode=ExactIn&onlyDirectRoutes=false&asLegacyTransaction=false&maxAccounts=64&minimizeSlippage=false&tokenCategoryBasedIntermediateTokens=true`
  );
  const data = await response.json();
  return {
    inAmount: data.inAmount,
    otherAmountThreshold: data.otherAmountThreshold,
    quoteResponse: data
  };
}

// Step 2: Fetch the swap transaction
async function fetchSwapTransaction(
  userWalletPublicKey: string,
  slip: number,
  swapInfo: any
) {
  const requestBody = {
    userPublicKey: userWalletPublicKey,
    wrapAndUnwrapSol: true,
    dynamicComputeUnitLimit: true,
    correctLastValidBlockHeight: true,
    asLegacyTransaction: false,
    allowOptimizedWrappedSolTokenAccount: true,
    prioritizationFeeLamports: {
      priorityLevelWithMaxLamports: {
        maxLamports: 4000000,
        global: false,
        priorityLevel: "veryHigh"
      }
    },
    dynamicSlippage: {
      maxBps: slip || 300
    },
    quoteResponse: swapInfo.quoteResponse
  };

  const response = await fetch(`${API_PREFIX}/v6/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  const { swapTransaction, lastValidBlockHeight } = await response.json();
  return { swapTransaction, lastValidBlockHeight };
}

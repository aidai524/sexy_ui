import { PublicKey, Connection, Keypair, VersionedTransaction, VersionedMessage, TransactionMessage, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useAccount } from './useAccount';
import { useCallback } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import * as anchor from "@coral-xyz/anchor";

interface Params {
    tokenAddress: string | undefined
}

const wsol = 'So11111111111111111111111111111111111111112'

export default function useJupiter({ tokenAddress }: Params) {
    const { connection } = useConnection()
    const { publicKey, walletProvider,  } = useAccount()

    const trade = useCallback(async () => {

        if (publicKey) {
            const useAccount = await getUserUSDCTokenAccount(publicKey)
            const swapInfo = await fetchSwapInfo(wsol, tokenAddress as string, '100000')
            const { swapTransaction, lastValidBlockHeight } = await fetchSwapTransaction(publicKey.toBase58(), useAccount.toBase58(), swapInfo)

            console.log(swapTransaction, swapInfo)

            // const bhInfo = await connection.getLatestBlockhashAndContext({ commitment: "finalized" });

            const latestBlockhash = await connection?.getLatestBlockhash();
      
            const vTransaction: any = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));

            // const transaction = vTransaction.sign([payer])
            vTransaction.recentBlockhash = latestBlockhash.blockhash;
            vTransaction.feePayer = publicKey;

            const hash = await walletProvider.signAndSendTransaction(vTransaction, {
                maxRetries: 5,
                skipPreflight: true,
                preflightCommitment: "finalized",
            })

            // console.log('hash')

        }
        
    }, [publicKey, walletProvider])

    return {
        trade
    }
}

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

async function getUserUSDCTokenAccount(userWalletPublicKey: PublicKey) {
    const bobUSDCTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        userWalletPublicKey,
        true,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return bobUSDCTokenAccount;
}


// Step 1: Fetch swap info
async function fetchSwapInfo(inputMint: string, outputMint: string, amount: string) {
    const response = await fetch(`https://quote-api.jup.ag/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&dynamicSlippage=true&swapMode=ExactIn&onlyDirectRoutes=false&asLegacyTransaction=false&maxAccounts=64&minimizeSlippage=false&tokenCategoryBasedIntermediateTokens=true`);
    const data = await response.json();
    return {
        inAmount: data.inAmount,
        otherAmountThreshold: data.otherAmountThreshold,
        quoteResponse: data
    };
}

// Step 2: Fetch the swap transaction
async function fetchSwapTransaction(userWalletPublicKey: string, userToenAccount: string, swapInfo: any) {
    const requestBody = {
      userPublicKey: userWalletPublicKey,
      wrapAndUnwrapSol: true,
      useSharedAccounts: true,
    //   feeAccount: userWalletPublicKey,  // Use actual key
    //   trackingAccount: userWalletPublicKey,  // Use actual key
      prioritizationFeeLamports: 0,  // No prioritization fee in this case
      asLegacyTransaction: false,
      useTokenLedger: false,
      destinationTokenAccount: userToenAccount,
      dynamicComputeUnitLimit: true,
      skipUserAccountsRpcCalls: true,
      quoteResponse: swapInfo.quoteResponse
    };
  
    const response = await fetch('https://quote-api.jup.ag/v6/swap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  
    const { swapTransaction, lastValidBlockHeight } = await response.json();
    return { swapTransaction, lastValidBlockHeight };
  }
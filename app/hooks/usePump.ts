import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import { pumpFunBuy, pumpFunSell, getCoinData} from '../utils/pumpSwap';
import { useAccount } from "./useAccount";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface Props {
    tokenAddress: string
}

export default function usePump({ tokenAddress }: Props) {
    const { connection } = useConnection()
    const { walletProvider } = useAccount()

    const buy = useCallback(async (amount: number) => {
        const hash = await pumpFunBuy(tokenAddress, amount, 0.25, connection, walletProvider);

        return hash
    }, [connection, walletProvider, tokenAddress])

    const sell = useCallback(async (amount: number) => {
        const hash = await pumpFunSell(tokenAddress, amount, 0.25, connection, walletProvider);

        return hash
    }, [connection, walletProvider, tokenAddress])

    const estimateToken = useCallback(async (solIn: number, slippageDecimal: number) => {
        const coinData = await getCoinData(tokenAddress)
        const solInLamports = solIn * LAMPORTS_PER_SOL;
        const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);

        return tokenOut
    }, [tokenAddress])

    const estimateSol = useCallback(async (tokenBalance: number, slippageDecimal: number) => {
        const coinData = await getCoinData(tokenAddress)
        const minSolOutput = Math.floor(tokenBalance! * (1 - slippageDecimal) * coinData["virtual_sol_reserves"] / coinData["virtual_token_reserves"]);

        return minSolOutput
    }, [tokenAddress])

    return {
        buy,
        sell,
        estimateToken,
        estimateSol,
    }
}

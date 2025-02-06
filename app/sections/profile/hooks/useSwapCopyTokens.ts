import { useState } from 'react';
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction, VersionedMessage } from '@solana/web3.js';
import bs58 from 'bs58';


interface CopyTradeParams {
  walletAddress: string;
  chain: string;
  type: number;
  sellAll: boolean;
  tokens: string[];
  id: string;
}
export const useSwapCopyTokens = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const CopyTradeService = new CopyTrade();
    const {
        publicKey,
        signTransaction,
        sendTransaction,
        wallet,
    } = useWallet();
    const { connection } = useConnection();
    // @param type 1: buy tokens, 2: swap tokens
    const handleSwapCopyTokens = async ({
      id,
      walletAddress,
      chain,
      type,
      sellAll,
      tokens
    }: CopyTradeParams) => {
      try {
        setIsLoading(true);
        const res = await CopyTradeService.swapCopyTokens({
          walletAddress,
          chain,
          type,
          sellAll,
          tokens,
          id
        });
        if (res.code == 200) {
            return true;
        } else {
          fail(res?.message, { maskStyle: { zIndex: 1001} });
          return false;
        }
      } catch (e: any) {
        fail(e?.message || "Swap tokens failed", {maskStyle: {zIndex: 1001}});
        return false;
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      isLoading,
      handleSwapCopyTokens
    };
  };
  
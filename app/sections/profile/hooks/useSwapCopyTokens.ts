import { useState } from "react";
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction, VersionedMessage } from "@solana/web3.js";
import bs58 from "bs58";
import { useAccount } from "@/app/hooks/useAccount";

interface CopyTradeParams {
  walletAddress: string;
  chain: string;
  type: number;
  sellAll: boolean;
  tokens: string[];
  id: string;
  closeCopyTrade: boolean;
}

export const useSwapCopyTokens = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const CopyTradeService = new CopyTrade();
  const { walletProvider } = useAccount();
  const { publicKey, signTransaction, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  // @param type 1: buy tokens, 2: swap tokens
  const handleSwapCopyTokens = async ({
    id,
    walletAddress,
    chain,
    type,
    sellAll,
    tokens,
    closeCopyTrade
  }: CopyTradeParams) => {
    try {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      const message = `Close and Sell Copy Trade,Id:${id},Timestamp:${timestamp}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await walletProvider?.signMessage?.(encodedMessage);
      if (!signature) {
        throw new Error("Failed to sign message");
      }

      const signatureBase58 = bs58.encode(signature);

      const res = await CopyTradeService.swapCopyTokens({
        walletAddress,
        chain,
        type,
        sellAll,
        tokens,
        id,
        sig: signatureBase58,
        timestamp,
        closeCopyTrade
      });

      if (res.code === 200) {
        success("Operation successful", { maskStyle: { zIndex: 1001 } });
        return true;
      } else {
        fail(res?.message, { maskStyle: { zIndex: 1001 } });
        return false;
      }
    } catch (e: any) {
      fail(e?.message || "Swap tokens failed", { maskStyle: { zIndex: 1001 } });
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

import { useState } from 'react';
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";

interface CopyTradeParams {
  walletAddress: string;
  copiedAddress: string;
  copyAmount: string;
  onceCopyAmount: string;
}

export const useCopyTrade = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const CopyTradeService = new CopyTrade();

  const handleCopyTrade = async ({
    walletAddress,
    copiedAddress,
    copyAmount,
    onceCopyAmount
  }: CopyTradeParams) => {
    try {
      setIsLoading(true);
      const res = await CopyTradeService.createCopyTrade({
        walletAddress,
        chain: "solana",
        from: copiedAddress,
        investment: +copyAmount,
        setting: {
          buyAmount: +onceCopyAmount,
          slippage: 0.5,
          errorToleranceRatio: 0.1
        }
      });
      
      if (res.code == 200) {
        success("Copy trade created successfully");
        return true;
      } else {
        fail(res?.message, { maskStyle: { zIndex: 1001} });
        return false;
      }
    } catch (e: any) {
      fail(e?.message || "Copy trade failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCopyTrade
  };
};
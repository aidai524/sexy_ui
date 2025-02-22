import { useState } from "react";
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction, VersionedMessage } from "@solana/web3.js";
import bs58 from "bs58";
import { useAccount } from "@/app/hooks/useAccount";

interface WithdrawClaimParams {
  address: string;
  amount: number;
  chain: string;
  receiver: string;
  id: string;
  walletAddress: string;
}

export const useWithdrawClaim = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const CopyTradeService = new CopyTrade();
  const { walletProvider } = useAccount();
  
  const handleWithdrawClaim = async ({
    address,
    amount,
    chain,
    receiver,
    id,
    walletAddress
  }: WithdrawClaimParams) => {
    try {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      const message = `Claim Copy Profit Share,Timestamp:${timestamp}`;
      const encodedMessage = new TextEncoder().encode(message);
      console.log(encodedMessage);
      const signature = await walletProvider?.signMessage?.(encodedMessage);
      if (!signature) {
        throw new Error("Failed to sign message");
      }

      const signatureBase58 = bs58.encode(signature);

      const res = await CopyTradeService.claimProfit({
        address,
        amount,
        chain,
        id,
        receiver,
        sig: signatureBase58,
        timestamp,
        type: 3,
        walletAddress
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
    handleWithdrawClaim
  };
};

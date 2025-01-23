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
        }
        // if (res.code == 200) {
        // const {messageData, session} = res.data;

        //   if (!signTransaction || !publicKey) {
        //     fail("Wallet not connected");
        //     return false;
        //   }
  
        //   try {
        //     const decodedMessage = bs58.decode(messageData);
        //     const messageUint8Array = new Uint8Array(decodedMessage);
        //     const versionedMessage = VersionedMessage.deserialize(messageUint8Array);
        //     const transaction = new VersionedTransaction(versionedMessage);
            
        //     const signedTx = await signTransaction(transaction);
        //     const serializedTx = bs58.encode(signedTx.serialize());
            
        //     const sendResponse = await CopyTradeService.sendTransaction({
        //       session,
        //       publicKey: publicKey.toString(),
        //       signature: serializedTx,
        //       type: 2,
        //     });
        //     console.log(sendResponse)
        //     success("Swap tokens success", {maskStyle: {zIndex: 1001}});
        //     return true;
        //   } catch (signError: any) {
        //     fail(`Transaction signing failed: ${signError.message}`, {maskStyle: {zIndex: 1001}});
        //     return false;
        //   }
        // } else {
        //   fail(res?.message, { maskStyle: { zIndex: 1001} });
        //   return false;
        // }
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
import { useState } from 'react';
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@/app/hooks/use-wallet";
import { VersionedTransaction, VersionedMessage } from '@solana/web3.js';
import bs58 from 'bs58';


interface CopyTradeParams {
  walletAddress: string;
  copiedAddress: string;
  copyAmount: string;
  onceCopyAmount: string;
}
export const useCopyTrade = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const CopyTradeService = new CopyTrade();
    const {
        publicKey,
        signTransaction,
        sendTransaction,
        wallet,
    } = useWallet();
    const { connection } = useConnection();
  
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
            slippage: 0.1,
            errorToleranceRatio: 0.1
          }
        });
        
        if (res.code == 200) {
          const {messageData, session} = res.data;
          if (!signTransaction || !publicKey) {
            fail("Wallet not connected");
            return false;
          }
  
          try {
            const decodedMessage = bs58.decode(messageData);
            const messageUint8Array = new Uint8Array(decodedMessage);
            const versionedMessage = VersionedMessage.deserialize(messageUint8Array);
            const transaction = new VersionedTransaction(versionedMessage);
            
            const signedTx = await signTransaction(transaction);
            const serializedTx = bs58.encode(signedTx.serialize());
            
            const sendResponse = await CopyTradeService.sendTransaction({
              session,
              publicKey: publicKey.toString(),
              signature: serializedTx,
              type: 1,
            });
  
            if (!sendResponse.data?.signature) {
              throw new Error('No transaction signature returned');
            }
            success("Copy trade success", {maskStyle: {zIndex: 1001}});
            return true;
          } catch (signError: any) {
            fail(`Transaction signing failed: ${signError.message}`, {maskStyle: {zIndex: 1001}});
            return false;
          }
        } else {
          fail(res?.message, { maskStyle: { zIndex: 1001} });
          return false;
        }
      } catch (e: any) {
        fail(e?.message || "Copy trade failed", {maskStyle: {zIndex: 1001}});
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
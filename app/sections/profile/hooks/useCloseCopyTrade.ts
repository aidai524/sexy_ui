import { useState } from 'react';
import CopyTrade from "@/app/services/copyTrade";
import { success, fail } from "@/app/utils/toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction, VersionedMessage } from '@solana/web3.js';
import bs58 from 'bs58';


interface CopyTradeParams {
  walletAddress: string;
  id: string;
  chain: string;
  state: number;
  isWithdraw?: boolean;
  tokens?: string[];
}
export const useCloseCopyTrade = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const CopyTradeService = new CopyTrade();
    const {
        publicKey,
        signTransaction,
        sendTransaction,
        wallet,
    } = useWallet();
    const { connection } = useConnection();
  
    const handleCloseCopyTrade = async ({
      walletAddress,
      id,
      chain,
      state,
      isWithdraw,
      tokens = []
    }: CopyTradeParams) => {
      try {
        setIsLoading(true);
        // if (isWithdraw) {
        //  await handleWithdrawTokens({walletAddress, id})
        // }
        const res = await CopyTradeService.closeCopyTrade({
          walletAddress,
          chain: "solana",
          state: state,
          id,
        });
        const {messageData, session} = res.data;
        
        if (res.code == 200) {
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
              type: 2,
            });
  
            success("Close copy trade success", {maskStyle: {zIndex: 1001}});
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
        fail(e?.message || "Close Copy trade failed", {maskStyle: {zIndex: 1001}});
        return false;
      } finally {
        setIsLoading(false);
      }
    };
    

    const handleWithdrawTokens = async ({
      walletAddress,
      id,
    }: any) => {
      try {
        setIsLoading(true);
        
        const res = await CopyTradeService.withdrawTokens({
            walletAddress,
            chain: "solana",
            tokens:[],
            id,
            withdrawAll: true
          });
        
       
        const {messageData, session} = res.data;
        
        if (res.code == 200) {
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
              type: 2,
            });
  
            success("Withdraw tokens success", {maskStyle: {zIndex: 1001}});
            return true;
          } catch (signError: any) {
            fail(`Withdraw tokens failed: ${signError.message}`, {maskStyle: {zIndex: 1001}});
            return false;
          }
        } else {
          fail(res?.message, { maskStyle: { zIndex: 1001} });
          return false;
        }
      } catch (e: any) {
        fail(e?.message || "Withdraw tokens failed", {maskStyle: {zIndex: 1001}});
        return false;
      } finally {
        setIsLoading(false);
      }
    };

    return {
      isLoading,
      handleCloseCopyTrade
    };
  };
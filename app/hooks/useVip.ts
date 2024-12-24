import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    Transaction,
} from '@solana/web3.js';
import { useCallback, useMemo } from "react";
import { useAccount } from '@/app/hooks/useAccount';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useConfig } from '../store/useConfig';
import Big from 'big.js';

interface Props {
    tokenName: string;
    tokenSymbol: string;
}

export function useVip() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const { walletProvider, connected } = useAccount();
    const { config }: any = useConfig()

    const call = useCallback(async (type: 'super-like' | 'boost' | 'vip' | 'launching', tokenAddress: string = '', justInstruction: boolean = false) => {
        let val = {}
        let lamports = 200000000
        if (type === 'super-like') {
            val = {"type":"AddSuperLike"}
        } else if (type === 'boost') {
            val = {"type":"AddBoost"}
            lamports = new Big(config.OnceBoostAmount).mul(10 ** 9).toNumber()
        } else if (type === 'vip') {
            val = {"type":"AddVip"}
        } else if (type === 'launching') {
            console.log('tokenAddress', tokenAddress)
            val = {"type":"AddLaunching", "token": tokenAddress}
            lamports = 100000000
        }

        const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

        const memoInstruction = new TransactionInstruction({
            keys: [],
            programId: memoProgramId,
            data: Buffer.from(JSON.stringify(val)),
        });

        const transferSOLInstruction = SystemProgram.transfer({
            fromPubkey: walletProvider.publicKey!,
            toPubkey: new PublicKey('EEzniCRUsjy9sqEqEi6jPEDF3kJehJxCxWrt2FuEQasH'),
            lamports,
        });

        if (justInstruction) {
            return [memoInstruction, transferSOLInstruction]
        }

        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        transaction.add(transferSOLInstruction).add(memoInstruction)

        const hash = await walletProvider.signAndSendTransaction(transaction)

        return hash

    }, [connection, walletProvider, publicKey])
  
    return {
        call,
    }

}


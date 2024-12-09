import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    Transaction,
} from '@solana/web3.js';
import { useCallback, useMemo } from "react";
import { useAccount } from '@/app/hooks/useAccount';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface Props {
    tokenName: string;
    tokenSymbol: string;
}

export function useVip() {
    const { connection } = useConnection()
    const { publicKey } = useWallet()
    const { walletProvider, connected } = useAccount();

    // const programId = useMemo(() => {
    //     return new PublicKey(
    //         "CcNrTgHd3HE7hj9zrurd1RwBadUVhcThdcY3cJBzAqwY"
    //     );
    // }, [])


    const call = useCallback(async (type: 'super-like' | 'boost' | 'vip') => {
        let val = {}
        if (type === 'super-like') {
            val = {"type":"AddSuperLike"}
        } else if (type === 'boost') {
            val = {"type":"AddBoost"}
        } else if (type === 'vip') {
            val = {"type":"AddVip"}
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
            lamports: 20000000,
        });

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


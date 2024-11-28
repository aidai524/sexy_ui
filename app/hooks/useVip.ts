import type { Connection } from '@reown/appkit-utils/solana';
import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    Transaction,
} from '@solana/web3.js';
import { useCallback, useMemo } from "react";
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'

interface Props {
    tokenName: string;
    tokenSymbol: string;
}

export function useVip() {
    const { connection } = useAppKitConnection()
    const { walletProvider } = useAppKitProvider<Provider>('solana')

    const programId = useMemo(() => {
        return new PublicKey(
            "CcNrTgHd3HE7hj9zrurd1RwBadUVhcThdcY3cJBzAqwY"
        );
    }, [])

    const call = useCallback(async (type: string) => {
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

        const v = await walletProvider.signAndSendTransaction(transaction)



    }, [connection, walletProvider, programId])
  
    return {
        call,
    }

}


import type { Connection } from '@reown/appkit-utils/solana';
import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    Transaction,
} from '@solana/web3.js';
import { u64 } from '@solana/buffer-layout-utils';
import { struct, u8, u32, f64, ns64, u48 } from "@solana/buffer-layout";
import { getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync, getAccount, Account, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, createSyncNativeInstruction } from '@solana/spl-token'
import { useCallback, useMemo } from "react";
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'

interface Props {
    tokenName: string;
    tokenSymbol: string;
}

export function useTokenTrade({
    tokenName, tokenSymbol
}: Props) {
    const { connection } = useAppKitConnection()
    const { walletProvider } = useAppKitProvider<Provider>('solana')

    const programId = useMemo(() => {
        return new PublicKey(
            "CcNrTgHd3HE7hj9zrurd1RwBadUVhcThdcY3cJBzAqwY"
        );
    }, [])

    const wsol = useMemo(() => {
        return new PublicKey('So11111111111111111111111111111111111111112');
    }, [])


    const _getOrCreateAssociatedTokenAccount = useCallback(async (mint: PublicKey, owner: PublicKey) => {
        if (!connection) {
            return null
        }

        const associatedToken = getAssociatedTokenAddressSync(
            mint,
            owner,
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
        );

        let account: Account | null = null;
        try {
            account = await getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID);
        } catch (error: unknown) {
            if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
                try {
                    const latestBlockhash = await connection?.getLatestBlockhash();
                    const xtransaction = new Transaction({
                        recentBlockhash: latestBlockhash!.blockhash,
                        feePayer: walletProvider.publicKey!
                    }).add(
                        createAssociatedTokenAccountInstruction(
                            walletProvider.publicKey!,
                            associatedToken,
                            owner,
                            mint,
                            TOKEN_PROGRAM_ID,
                            ASSOCIATED_TOKEN_PROGRAM_ID,
                        ),
                    );
    
                    await walletProvider.signAndSendTransaction(xtransaction)
    
                    account = await getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID);
                } catch(e) {
                    console.log(e)
                }
            }
        }

        return account

    }, [connection, walletProvider])

   


    const getKeys = useCallback(async () => {
        const state = PublicKey.findProgramAddressSync(
            [Buffer.from("launchpad")],
            programId
        )

        const protocolSolAccount = await _getOrCreateAssociatedTokenAccount(wsol, state[0])

        if (!protocolSolAccount) {
            return null
        }

        const pool = PublicKey.findProgramAddressSync(
            [Buffer.from("token_info"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        const tokenInfo = PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        const userSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            walletProvider.publicKey!,
        );

        if (!userSolAccount) {
            return null
        }

        const poolSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            pool[0]
        );

        if (!poolSolAccount) {
            return null
        }

        const userTokenAccount = await _getOrCreateAssociatedTokenAccount(
            tokenInfo[0],
            walletProvider.publicKey!
        );

        if (!userTokenAccount) {
            return null
        }

        const poolTokenAccount = await _getOrCreateAssociatedTokenAccount(
            tokenInfo[0],
            pool[0],
        );

        if (!poolTokenAccount) {
            return null
        }

        return [
            {
                pubkey: state[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: protocolSolAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: protocolSolAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: pool[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: wsol,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: userSolAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: poolSolAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: tokenInfo[0],
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: userTokenAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: poolTokenAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: walletProvider.publicKey!,
                isSigner: true,
                isWritable: true
            },
            {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false
            }

        ]
    }, [programId, wsol, tokenName, tokenSymbol, walletProvider])

    const buyToken = useCallback(async () => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        let allocateStruct = {
            layout: struct([u64("sol_amount"), f64("max_price"), u8()]),
        };

        console.log('allocateStruct.layout.span: ', allocateStruct.layout)

        const data = Buffer.alloc(allocateStruct.layout.span);

        const layoutFields = {
            // instruction: 138,
            sol_amount: 20000000,
            max_price: 200000,
        };

        allocateStruct.layout.encode(layoutFields, data);

        const discriminator = Buffer.from([
            138,
            127,
            14,
            91,
            38,
            87,
            115,
            105
        ])

        const newData = Buffer.concat([discriminator, data])

        const keys = await getKeys()

        console.log('keys: ', keys)


        console.log('data: ', data, newData)
        // return

        if (!keys) {
            return
        }
      
        await wrapToWSol(walletProvider, connection!, walletProvider.publicKey!, keys[5].pubkey, 20000000)

        transaction.add(
            new TransactionInstruction({
                keys,
                programId,
                data: newData,
            })
        )

        const v = await walletProvider.signAndSendTransaction(transaction)
    }, [connection, walletProvider, programId])


    const sellToken = useCallback(async () => {
   
        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });


        let allocateStruct = {
            layout: struct([u64("amount"), u64("min_wsol_amount"), u8()]),
        };

        console.log('allocateStruct.layout.span: ', allocateStruct.layout)

        let data = Buffer.alloc(allocateStruct.layout.span);


        let layoutFields = {
            // instruction: 138,
            amount: 60000,
            min_wsol_amount: 100000,
        };

        allocateStruct.layout.encode(layoutFields, data);

        const discriminator = Buffer.from([
           109,
           61,
           40,
           187,
           230,
           176,
           135,
           174
        ])

        const newData = Buffer.concat([discriminator, data])

        console.log('data: ', data, newData)
           
            const keys = await getKeys()
            if (!keys) {
                return
            }

            transaction.add(
                new TransactionInstruction({
                    keys,
                    programId,
                    data: newData,
                })
            )

            const v = await walletProvider.signAndSendTransaction(transaction)

            console.log(v)

    }, [connection, walletProvider, programId])

    return {
        buyToken,
        sellToken
    }

}

async function wrapToWSol(provider: Provider, connection: Connection, user: PublicKey, wsolAccount: PublicKey, amount: any) {
    const latestBlockhash = await connection?.getLatestBlockhash();

    const transaction = new Transaction({
        recentBlockhash: latestBlockhash!.blockhash,
        feePayer: provider.publicKey!
    }).add(
        SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: wsolAccount,
            lamports: amount, // 以 lamports 为单位 (1 SOL = 1e9 lamports)
        }),
        createSyncNativeInstruction(wsolAccount, TOKEN_PROGRAM_ID)
    );

    // 发送交易
    const txid = await provider.signAndSendTransaction(transaction);
    console.log("wrapToWSol txId:" + txid)

    let balance = await connection.getTokenAccountBalance(wsolAccount);
    console.log("TokenAccount balance: ", balance.value);
}
import type { AnyTransaction, Connection } from '@reown/appkit-utils/solana';
import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
// @ts-ignore
import { u64 } from '@solana/buffer-layout-utils';
import { struct, u8, u32, f64, ns64, u48, blob } from "@solana/buffer-layout";
import { getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync, getAccount, Account, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, createSyncNativeInstruction } from '@solana/spl-token'
import { useCallback, useMemo } from "react";
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import idl from './meme_launchpad.json'
import { BN, Program } from '@coral-xyz/anchor';
import * as borsh from 'borsh';
import bs58 from 'bs58';

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
        return new PublicKey("Cgrfh3YVBfPwJ8gzfM1yawJsqeYJJZCt6T46B29EaBe9")
    }, [])

    const wsol = useMemo(() => {
        return new PublicKey('So11111111111111111111111111111111111111112')
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
                } catch (e) {
                    console.log(e)
                }
            }
        }

        return account

    }, [connection, walletProvider])


    const getCreateAccountKeys = useCallback(async (tokenName: string, tokenSymbol: string) => {
        const state = PublicKey.findProgramAddressSync(
            [Buffer.from("launchpad")],
            programId
        )

        const pool = PublicKey.findProgramAddressSync(
            [Buffer.from("token_info"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        const tokenInfo = PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        return [
            {
                pubkey: state[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: pool[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: tokenInfo[0],
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
    }, [programId, wsol, walletProvider])

    const getCreateInfoKeys = useCallback(async (tokenName: string, tokenSymbol: string) => {
        const state = PublicKey.findProgramAddressSync(
            [Buffer.from("launchpad")],
            programId
        )

        const pool = PublicKey.findProgramAddressSync(
            [Buffer.from("token_info"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        const tokenInfo = PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );

        const metaDataAddress = await getMetaData(tokenInfo[0])

        const protocolSolAccount = await _getOrCreateAssociatedTokenAccount(wsol, state[0])

        if (!protocolSolAccount) {
            return null
        }

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
                pubkey: pool[0],
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: metaDataAddress[0],
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
                isWritable: false
            },
            {
                pubkey: poolSolAccount.address,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: poolSolAccount.address,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: protocolSolAccount.address,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: tokenInfo[0],
                isSigner: false,
                isWritable: false
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
            },

            {
                pubkey: SYSVAR_RENT_PUBKEY,
                isSigner: false,
                isWritable: false
            },
            {
                pubkey: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
                isSigner: false,
                isWritable: false
            },

        ]
    }, [programId, wsol, walletProvider])

    const getKeys = useCallback(async () => {
        console.log(tokenName, tokenSymbol)

        const state = PublicKey.findProgramAddressSync(
            [Buffer.from("launchpad")],
            programId
        )
        
        const referral = new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm')
        const proxy = new PublicKey('8GBcwJAfUU9noxPNh5jnfwkKipK8XRHUPS5va9TAXr5f')

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

        console.log('userSolAccount: ', userSolAccount, 1111222)

        const poolSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            pool[0]
        );

        if (!poolSolAccount) {
            return null
        }

        console.log('poolSolAccount:', pool, poolSolAccount, 1111222222)

        const userTokenAccount = await _getOrCreateAssociatedTokenAccount(
            tokenInfo[0],
            walletProvider.publicKey!
        );

        console.log('userTokenAccount:', tokenInfo, walletProvider, userTokenAccount, 111122222233333)

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

        const referralRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("referral_record"), state[0].toBuffer(), walletProvider.publicKey!.toBuffer()],
            programId
        )

        const referralSolAccount = await _getOrCreateAssociatedTokenAccount(wsol, referral)
        const proxySolAccount = await _getOrCreateAssociatedTokenAccount(wsol, proxy)

        if (!referralSolAccount || !proxySolAccount) {
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
                pubkey: referralSolAccount.address,
                isSigner: false,
                isWritable: true
            },
            {
                pubkey: proxySolAccount.address,
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
                pubkey: referralRecord[0],
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

    }, [programId, wsol, tokenName, tokenSymbol, walletProvider, connection])

    const buyToken = useCallback(async () => {


        const latestBlockhash = await connection?.getLatestBlockhash();

        // const transaction = new Transaction({
        //     recentBlockhash: latestBlockhash!.blockhash,
        //     feePayer: walletProvider.publicKey!
        // });

        
        // let allocateStruct = {
        //     layout: struct([u64("solAmount"), u64("maxPrice"), blob(32, 'recommenderOp'), blob(32, 'proxyOp')]),
        // };

        // console.log('allocateStruct.layout.span: ', allocateStruct.layout)

        // let data = Buffer.alloc(allocateStruct.layout.span);


        // let layoutFields = {
        //     // instruction: 138,
        //     solAmount: 60000,
        //     maxPrice: 100000,
        //     recommenderOp: new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
        //     proxyOp: new PublicKey('8GBcwJAfUU9noxPNh5jnfwkKipK8XRHUPS5va9TAXr5f')
        // };


        // allocateStruct.layout.encode(layoutFields, data);

        // const discriminator = Buffer.from([
        //     138,
        //     127,
        //     14,
        //     91,
        //     38,
        //     87,
        //     115,
        //     105
        // ])

        // const newData = Buffer.concat([discriminator, data])

        const keys = await getKeys()


        console.log('keys: ', keys)

        // console.log('data: ', data, newData)
        // return

        if (!keys) {
            return
        }

        // await wrapToWSol(walletProvider, connection!, walletProvider.publicKey!, keys[6].pubkey, 200000000)

        // transaction.add(
        //     new TransactionInstruction({
        //         keys,
        //         programId,
        //         data: newData,
        //     })
        // )

        const program = new Program<any>(idl, programId, walletProvider as any);

        const tx:any = await program.methods.buyToken(
            new anchor.BN(200000000), 
            new anchor.BN(200000), 
            new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'), 
            keys[3].pubkey
        ).accounts({
            launchpad: keys[0].pubkey,
            protocolSolAccount: keys[1].pubkey,
            referralSolAccount: keys[2].pubkey,
            proxySolAccount: keys[3].pubkey,
            pool: keys[4].pubkey,
    
            wsolMint: keys[5].pubkey,
            userWsolAccount: keys[6].pubkey,
            poolWsolAccount: keys[7].pubkey,
    
            tokenMint: keys[8].pubkey,
            userTokenAccount: keys[9].pubkey,
            poolTokenAccount: keys[10].pubkey,
    
            referralRecord: keys[11].pubkey,
    
            tokenProgram: keys[12].pubkey,
            associatedTokenProgram: keys[13].pubkey,
            user: keys[14].pubkey,
            systemProgram: keys[15].pubkey,
        }).transaction()

        console.log('tx:', tx)
        tx.recentBlockhash = latestBlockhash!.blockhash
        tx.feePayer = walletProvider.publicKey!

        const v = await walletProvider.signAndSendTransaction(tx)

        console.log('v:', v)
    }, [connection, walletProvider, programId])


    const sellToken = useCallback(async () => {

        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });


        let allocateStruct = {
            layout: struct([u64("solAmount"), u64("maxPrice"), blob(32, 'recommenderOp'), blob(32, 'proxyOp')]),
        };

        console.log('allocateStruct.layout.span: ', allocateStruct.layout)

        let data = Buffer.alloc(allocateStruct.layout.span);


        let layoutFields = {
            // instruction: 138,
            solAmount: 60000,
            maxPrice: 100000,
            recommenderOp: '5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm',
            proxyOp: ''
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

    const createToken = useCallback(async () => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        const createTokenAccountDiscriminator = Buffer.from([
            147,
            241,
            123,
            100,
            244,
            132,
            174,
            118
        ])

        const tokenName = 'Bew'
        const tokenSymbol = 'BEW'

        const schema = { struct: { name: 'string', symbol: 'string', 'uri': 'string', total_supply: 'u64', decimals: 'u8' } }

        const value = {
            name: tokenName,
            symbol: tokenSymbol,
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5OFEFG_fL5HaY7e4v623Lyrj4IH0bmR41g&s',
            total_supply: 100000000,
            decimals: 2
        }

        const data = borsh.serialize(schema, value);

        const createTokenAccountData = Buffer.concat([createTokenAccountDiscriminator, data])

        console.log('data: ', data, createTokenAccountData)

        const createAccountKeys = await getCreateAccountKeys(tokenName, tokenSymbol)
        if (!createAccountKeys) {
            return
        }

        console.log('keys:', createAccountKeys)

        transaction.add(
            new TransactionInstruction({
                keys: createAccountKeys,
                programId,
                data: createTokenAccountData,
            })
        )

        // console.log(transaction, hhh)

        const v1 = await walletProvider.signAndSendTransaction(transaction)

        console.log('v1:', v1)

        const createTokenInfoDiscriminator = Buffer.from([
            30,
            167,
            33,
            61,
            29,
            95,
            231,
            152
        ])

        const createTokenInfoData = Buffer.concat([createTokenInfoDiscriminator, data])

        const createInfoKeys = await getCreateInfoKeys(tokenName, tokenSymbol)

        if (!createInfoKeys) {
            return
        }

        // const program = new Program<any>(idl, walletProvider as any);

        // console.log('program:', program)

        // @ts-ignore
        // const hhh = await program.methods.createTokenInfo(
        //     {
        //         name: tokenName,
        //         symbol: tokenSymbol,
        //         uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5OFEFG_fL5HaY7e4v623Lyrj4IH0bmR41g&s',
        //         totalSupply: new anchor.BN(100000000),
        //         decimals: new anchor.BN(2),
        //     }
        // ).accounts({
        //     launchpad: createInfoKeys[0].pubkey,
        //     pool: createInfoKeys[1].pubkey,
        //     metadata: createInfoKeys[2].pubkey,
        //     wsolMint: createInfoKeys[3].pubkey,
        //     userWsolAccount: createInfoKeys[4].pubkey,
        //     poolWsolAccount: createInfoKeys[5].pubkey,
        //     protocolWsolAccount: createInfoKeys[6].pubkey,
        //     tokenMint: createInfoKeys[7].pubkey,
        //     poolTokenAccount: createInfoKeys[8].pubkey,

        //     tokenProgram: createInfoKeys[9].pubkey,
        //     associatedTokenProgram: createInfoKeys[10].pubkey,
        //     user: createInfoKeys[11].pubkey,
        //     systemProgram: createInfoKeys[12].pubkey,
        //     rent: createInfoKeys[13].pubkey,
        //     tokenMetadataProgram: createInfoKeys[14].pubkey,
        // }).transaction()

        // hhh.feePayer = walletProvider.publicKey!
        // hhh.recentBlockhash = latestBlockhash!.blockhash

        // console.log('createInfoKeys:', createInfoKeys)

        await wrapToWSol(walletProvider, connection!, walletProvider.publicKey!, createInfoKeys[4].pubkey, 20000000)

        const latestBlockhash2 = await connection?.getLatestBlockhash();
        const createTokenInfoTransaction = new Transaction({
            recentBlockhash: latestBlockhash2!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        createTokenInfoTransaction
            // .add(
            //     new TransactionInstruction({
            //         keys: createAccountKeys,
            //         programId,
            //         data: createTokenAccountData,
            //     })
            // )
            .add(
                new TransactionInstruction({
                    keys: createInfoKeys,
                    programId,
                    data: createTokenInfoData,
                })
            )

        console.log('createTokenInfoTransaction:', createTokenInfoTransaction)

        const v2 = await walletProvider.signAndSendTransaction(createTokenInfoTransaction)

        console.log('v2:', v2)


    }, [connection, walletProvider, programId])

    return {
        buyToken,
        sellToken,
        createToken,
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


async function getMetaData(tokenMint: PublicKey) {
    const METADATA_SEED = "metadata";
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

    const metaData = PublicKey.findProgramAddressSync(
        [Buffer.from(METADATA_SEED), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
    )

    return metaData
}
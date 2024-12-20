import {
    PublicKey,
    SystemProgram,
    TransactionInstruction,
    TransactionSignature,
    Transaction,
    SYSVAR_RENT_PUBKEY,
    ComputeBudgetProgram,
    // ComputeBudgetProgram,
} from '@solana/web3.js';
import Big from 'big.js'
import * as anchor from "@coral-xyz/anchor";
// @ts-ignore
import { u64 } from '@solana/buffer-layout-utils';
import { struct, u8, u32, f64, ns64, u48, blob } from "@solana/buffer-layout";
import { getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync, getAccount, Account, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, TokenAccountNotFoundError, TokenInvalidAccountOwnerError, createSyncNativeInstruction } from '@solana/spl-token'
import { useCallback, useEffect, useMemo, useState } from "react";
import idl from './meme_launchpad.json'
import { BN, Program } from '@coral-xyz/anchor';
import * as borsh from 'borsh';
import bs58 from 'bs58';
import { httpAuthPost, sleep } from '../utils';
import { useConnection } from '@solana/wallet-adapter-react';
import { useAccount } from '@/app/hooks/useAccount';
import { useClickAway } from 'ahooks';
import { constants } from 'node:fs';

interface Props {
    tokenName: string;
    tokenSymbol: string;
    tokenDecimals: number;
    loadData?: boolean;
}

export function useTokenTrade({
    tokenName, tokenSymbol, tokenDecimals, loadData = true
}: Props) {
    const { connection } = useConnection();
    const { walletProvider } = useAccount();
    const [rate, setRate] = useState<number>()
    const [minPrice, setMinPrice] = useState(1)
    const [maxPrice, setMaxPrice] = useState(1)
    const [tokenBalance, setTokenBalance] = useState('0')
    const [solBalance, setSolBalance] = useState('0')
    const [reFreshBalnace, setReFreshBalnace] = useState(0)

    const programId = useMemo(() => {
        return new PublicKey("AYdgC17ymp4CkbbZ7pED2oa5hdnsp4dZVKJtt9542kFh")
    }, [])

    const wsol = useMemo(() => {
        return new PublicKey('So11111111111111111111111111111111111111112')
    }, [])

    const state = useMemo(() => {
        return PublicKey.findProgramAddressSync(
            [Buffer.from("launchpad")],
            programId
        )
    }, [programId])

    const pool = useMemo(() => {
        if (!tokenName || !tokenSymbol) return null

        return PublicKey.findProgramAddressSync(
            [Buffer.from("token_info"), state[0].toBuffer(), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );
    }, [programId, state, tokenName, tokenSymbol])


    const tokenInfo = useMemo(() => {
        if (!tokenName || !tokenSymbol) return null

        return PublicKey.findProgramAddressSync(
            [Buffer.from("mint"), state[0].toBuffer(), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
            programId
        );
    }, [programId, state, tokenName, tokenSymbol])

    const _getOrCreateAssociatedTokenAccount = useCallback(async (mint: PublicKey, owner: PublicKey, isCreate: boolean = true) => {
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
            if (isCreate) {
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

                        while (true) {
                            try {
                                account = await getAccount(connection, associatedToken, undefined, TOKEN_PROGRAM_ID);
                                await sleep(500)
                                break
                            } catch(e) {
                                console.log('e:', e)
                            }
                        }
                        
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        }

        return account

    }, [connection, walletProvider])

    const getKeys = useCallback(async () => {
        console.log(tokenName, tokenSymbol)
        if (!tokenName || !tokenSymbol || !pool || !tokenInfo)  return null

        const referral = new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm')
        const proxy = new PublicKey('8GBcwJAfUU9noxPNh5jnfwkKipK8XRHUPS5va9TAXr5f')

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

        console.log('userSolAccount: ', userSolAccount)

        const poolSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            pool[0]
        );

        if (!poolSolAccount) {
            return null
        }

        console.log('poolSolAccount:', pool, poolSolAccount)

        const userTokenAccount = await _getOrCreateAssociatedTokenAccount(
            tokenInfo[0],
            walletProvider.publicKey!
        );

        console.log('userTokenAccount:', userTokenAccount)

        if (!userTokenAccount) {
            return null
        }

        const poolTokenAccount = await _getOrCreateAssociatedTokenAccount(
            tokenInfo[0],
            pool[0],
        );

        console.log('poolTokenAccount:', poolTokenAccount)

        if (!poolTokenAccount) {
            return null
        }

        const referralRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("referral_record"), state[0].toBuffer(), walletProvider.publicKey!.toBuffer()],
            programId
        )

        let referralUser: any = PublicKey.default
        try {
            const accountInfo = await connection.getAccountInfo(referralRecord[0]);
            if (accountInfo) {
                const program = new Program<any>(idl, programId, { connection: connection } as any);
                const referralAccount: any = await program.account.referralRecord.fetch(referralRecord[0]);
                referralUser = referralAccount.user
            }
        } catch (e) {
        }
        
        console.log('accountInfo:', referralUser)

        const referralFeeRateRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("referral_fee_rate_record"), state[0].toBuffer(), referralUser.toBuffer()],
            programId
        )

        const referralSolAccount = await _getOrCreateAssociatedTokenAccount(wsol, referral)
        const proxySolAccount = await _getOrCreateAssociatedTokenAccount(wsol, proxy)

        if (!referralSolAccount || !proxySolAccount) {
            return null
        }

        return {
            launchpad: state[0],
            protocolSolAccount: protocolSolAccount.address,
            referralSolAccount: referralSolAccount.address,
            proxySolAccount: proxySolAccount.address,
            pool: pool[0],

            wsolMint: wsol,
            userWsolAccount: userSolAccount.address,
            poolWsolAccount: poolSolAccount.address,

            tokenMint: tokenInfo[0],
            userTokenAccount: userTokenAccount.address,
            poolTokenAccount: poolTokenAccount.address,

            referralRecord: referralRecord[0],
            referralFeeRateRecord: referralFeeRateRecord[0],

            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            user: walletProvider.publicKey!,
            systemProgram: SystemProgram.programId,
        }

    }, [programId, wsol, state, pool, tokenInfo, tokenName, tokenSymbol, walletProvider, connection])

    const getWithdrawKeys = useCallback(async () => {
        if (!tokenName || !tokenSymbol || !pool || !tokenInfo)  return null

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

        const prePaidRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("prepaid_record"), pool[0].toBuffer(), walletProvider.publicKey!.toBuffer()],
            programId
        );

        return {
            launchpad: state[0],
            pool: pool[0],
            wsolMint: wsol,
            userWsolAccount: userSolAccount.address,
            poolWsolAccount: poolSolAccount.address,

            paidRecord: prePaidRecord[0],

            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            user: walletProvider.publicKey!,
            systemProgram: SystemProgram.programId,
        }
    }, [programId, wsol, state, pool, tokenInfo, tokenName, tokenSymbol, walletProvider, connection])

    const getCreateKeys = useCallback((tokenName: string, tokenSymbol: string) => {
        if (!pool || !tokenInfo) {
            return null
        }

        return {
            launchpad: state[0],
            pool: pool[0],
            tokenInfo: tokenInfo[0]
        }

    }, [programId, state, pool, tokenInfo])

    const buyToken = useCallback(async (amount: string | number) => {

        const latestBlockhash = await connection?.getLatestBlockhash();

        const keys = await getKeys()

        if (!keys) {
            return
        }

        const instruction1 = SystemProgram.transfer({
            fromPubkey: walletProvider.publicKey!,
            toPubkey: keys.userWsolAccount,
            lamports: Number(amount),
        })
        const instruction2 = createSyncNativeInstruction(keys.userWsolAccount, TOKEN_PROGRAM_ID)

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        const program = new Program<any>(idl, programId, walletProvider as any);

        const buyInstruction = await program.methods.buyToken(
            new anchor.BN(amount),
            new anchor.BN(maxPrice),
            new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
            keys.proxySolAccount
        ).accounts(keys).instruction()

        transaction.add(instruction1).add(instruction2).add(buyInstruction)

        // tx.recentBlockhash = latestBlockhash!.blockhash
        // tx.feePayer = walletProvider.publicKey!


        const v = await walletProvider.signAndSendTransaction(transaction)

        console.log('v:', v)
    }, [connection, walletProvider, programId, maxPrice])

    const buyTokenWithFixedOutput = useCallback(async (outputAmount: string | number, maxWsolAmount: string | number,) => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const keys = await getKeys()

        console.log('keys: ', keys)

        if (!keys) {
            return
        }

        const instruction1 = SystemProgram.transfer({
            fromPubkey: walletProvider.publicKey!,
            toPubkey: keys.userWsolAccount,
            lamports: Number(maxWsolAmount),
        })
        const instruction2 = createSyncNativeInstruction(keys.userWsolAccount, TOKEN_PROGRAM_ID)

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        const program = new Program<any>(idl, programId, walletProvider as any);

        const buyInstruction = await program.methods.buyTokenWithFixedOutput(
            new anchor.BN(outputAmount),
            new anchor.BN(maxWsolAmount),
            new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
            keys.proxySolAccount
        ).accounts(keys).instruction()

        transaction.add(instruction1).add(instruction2).add(buyInstruction)

        // buyInstruction.recentBlockhash = latestBlockhash!.blockhash
        // buyInstruction.feePayer = walletProvider.publicKey!

        const confirmationStrategy: any = {
            skipPreflight: true,
            // preflightCommitment: 'processed',
        };

        const hash = await walletProvider.signAndSendTransaction(transaction, confirmationStrategy)

        console.log('hash:', hash)

        return hash
    }, [connection, walletProvider, programId])

    const sellToken = useCallback(async (amount: number | string, minWsolAmount: number | string,) => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const keys = await getKeys()
        if (!keys) {
            return
        }

        // console.log('minWsolAmount:', minWsolAmount)

        const program = new Program<any>(idl, programId, { connection: connection } as any);

        const tx: any = await program.methods.sellToken(
            new anchor.BN(amount),
            new anchor.BN(minWsolAmount),
            new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
            keys.proxySolAccount,
        ).accounts(keys).transaction()

        console.log('tx:', tx)
        tx.recentBlockhash = latestBlockhash!.blockhash
        tx.feePayer = walletProvider.publicKey!

        const confirmationStrategy: any = {
            skipPreflight: true,
            preflightCommitment: 'processed',
        };

        const hash = await walletProvider.signAndSendTransaction(tx, confirmationStrategy)
        console.log('hash:', hash)
        return hash

    }, [connection, walletProvider, programId])

    const sellTokenWithFixedOutput = useCallback(async (outputAmount: string | number, maxMemeAmount: string | number,) => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const keys = await getKeys()


        if (!keys) {
            return
        }

        const program = new Program<any>(idl, programId, { connection: connection } as any);

        const tx: any = await program.methods.sellTokenWithFixedOutput(
            new anchor.BN(outputAmount),
            new anchor.BN(maxMemeAmount),
            new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
            keys.proxySolAccount,
        ).accounts(keys).transaction()

        console.log('tx:', tx)
        tx.recentBlockhash = latestBlockhash!.blockhash
        tx.feePayer = walletProvider.publicKey!

        // const confirmationStrategy: any = {
        //     // skipPreflight: true,
        //     // preflightCommitment: 'processed',
        // };

        const hash = await walletProvider.signAndSendTransaction(tx)

        return hash

    }, [connection, walletProvider, programId, minPrice])

    const createToken = useCallback(async ({ name, symbol, uri, amount }: { name: string, symbol: string, uri: string, amount?: string }) => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        const program = new Program<any>(idl, programId, walletProvider as any);

        // const name = 'HeHe'
        // const symbol = 'HEHE'
        // const uri = 'https://www.npmjs.com/npm-avatar/eyJhbG'

        const keys = await getCreateKeys(name, symbol)

        if (!keys) {
            throw 'Create keys error'
        }

        const createAccountTransition: any = await program.methods.createTokenAccount({
            name: name,
            symbol: symbol,
            uri: uri,
            totalSupply: new anchor.BN(100000000),
            decimals: new anchor.BN(2),
        }).accounts({
            launchpad: keys.launchpad,
            pool: keys.pool,
            tokenMint: keys.tokenInfo,

            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            user: walletProvider.publicKey!,
            systemProgram: anchor.web3.SystemProgram.programId,
        }).transaction()

        createAccountTransition.recentBlockhash = latestBlockhash!.blockhash
        createAccountTransition.feePayer = walletProvider.publicKey!

        const v2 = await walletProvider.signAndSendTransaction(createAccountTransition)

        console.log('create account success', v2)

        const METADATA_SEED = "metadata";
        const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        const [metadataAddress] = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from(METADATA_SEED),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                keys.tokenInfo.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        const userSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            walletProvider.publicKey!,
        );

        if (!userSolAccount) {
            throw 'Create userSolAccount failed'
        }

        const poolSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            keys.pool
        );

        if (!poolSolAccount) {
            throw 'Create poolSolAccount failed'
        }

        const poolTokenAccount = await _getOrCreateAssociatedTokenAccount(
            keys.tokenInfo,
            keys.pool
        );

        if (!poolTokenAccount) {
            throw 'Create poolTokenAccount failed'
        }

        const protocolSolAccount = await _getOrCreateAssociatedTokenAccount(wsol, keys.launchpad)

        if (!protocolSolAccount) {
            throw 'Create protocolSolAccount failed'
        }

        const createInfoTransition = await program.methods.createTokenInfo({
            name: name,
            symbol: symbol,
            uri: uri,
            totalSupply: new anchor.BN(100000000000),
            decimals: new anchor.BN(2),
        }).accounts({
            launchpad: keys.launchpad,
            pool: keys.pool,

            metadata: metadataAddress,
            wsolMint: wsol,
            userWsolAccount: userSolAccount!.address,
            poolWsolAccount: poolSolAccount!.address,
            protocolWsolAccount: protocolSolAccount!.address,
            tokenMint: keys.tokenInfo,
            poolTokenAccount: poolTokenAccount!.address,

            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            user: walletProvider.publicKey!,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        }).instruction()

        // createInfoTransition.recentBlockhash = latestBlockhash!.blockhash
        // createInfoTransition.feePayer = walletProvider.publicKey!

        const instruction1 = SystemProgram.transfer({
            fromPubkey: walletProvider.publicKey!,
            toPubkey: userSolAccount.address,
            lamports: 20000000, 
        })
        const instruction2 = createSyncNativeInstruction(userSolAccount.address, TOKEN_PROGRAM_ID)
        
        transaction
        .add(
            ComputeBudgetProgram.setComputeUnitLimit({
                units: 991600000,
            })
        )
        .add(instruction1)
        .add(instruction2)
        .add(createInfoTransition)

        const v3 = await walletProvider.signAndSendTransaction(transaction)

        console.log('v3:', v3)

        if (amount) {
            // const val = await httpAuthPost(`/project/prepaid?amount=${amount}&name=${tokenName}&symbol=${tokenSymbol}`)
            const prepaidTrans = await prePaid(amount, tokenName, tokenSymbol, false)

            // console.log('prepaidTrans:', prepaidTrans)

            // if (prepaidTrans) {
            //     transaction.add(prepaidTrans)
            // }
        }

        

        return v3

    }, [connection, walletProvider, programId, wsol])

    const prePaid = useCallback(async (amount: number | string, tokenName: string, tokenSymbol: string, justTransaction: boolean = false) => {
        
        let i = 0
        let val
        while (i < 50) {
            val = await httpAuthPost(`/project/prepaid?amount=${amount}&name=${tokenName}&symbol=${tokenSymbol}`)
            if (val.code !== 0) {
                i++
                await sleep(2000)
            } else {
                break
            }
        }

        if (val.code !== 0) {
            throw 'fetch prepaid data error'
        }


        console.log('val:', val)

        

        const userSolAccount = await _getOrCreateAssociatedTokenAccount(
            wsol,
            walletProvider.publicKey!,
        );

        if (!userSolAccount) {
            throw 'Create userSolAccount failed'
        }
      
        const latestBlockhash = await connection?.getLatestBlockhash();

        const transaction = new Transaction({
            recentBlockhash: latestBlockhash!.blockhash,
            feePayer: walletProvider.publicKey!
        });

        const signatureBytes = Buffer.from(val.data, 'base64')

        const serverTransaction = Transaction.from(signatureBytes)

        const instruction1 = SystemProgram.transfer({
            fromPubkey: walletProvider.publicKey!,
            toPubkey: userSolAccount?.address,
            lamports: Number(amount) + 50000, 
        })
        const instruction2 = createSyncNativeInstruction(userSolAccount?.address, TOKEN_PROGRAM_ID)

        // serverTransaction.recentBlockhash = latestBlockhash!.blockhash

        // console.log('serverTransaction:', serverTransaction, walletProvider, latestBlockhash)

        const confirmationStrategy: any = {
            skipPreflight: true,
            maxRetries: 10,
            preflightCommitment: 'processed',
        };

        transaction
        .add(instruction1)
        .add(instruction2)
        // .add(serverTransaction)
        // .add(
        //     ComputeBudgetProgram.setComputeUnitLimit({
        //         units: 1000000,
        //     })
        // )

        if (justTransaction) {
            return transaction
        }

        const hash1 = await walletProvider.signAndSendTransaction(transaction, confirmationStrategy)
        console.log(hash1)

        const hash2 = await walletProvider.signAndSendTransaction(serverTransaction, confirmationStrategy)
        console.log('hash', hash2)

        // return hash2   
    }, [programId, walletProvider, connection, wsol])

    const prepaidSolWithdraw = useCallback(async () => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const program = new Program<any>(idl, programId, { connection: connection } as any);
        const keys = await getWithdrawKeys()

        if (!keys) {
            return
        }


        console.log('keys:', keys)

        const outputAmount = await checkPrePayed()

        console.log('outputAmount:', outputAmount)

        if (outputAmount > 0) {
            const tx: any = await program.methods.prepaidSolWithdraw(
                new anchor.BN(outputAmount),
            ).accounts(keys).transaction()
    
            console.log('tx:', tx)
            tx.recentBlockhash = latestBlockhash!.blockhash
            tx.feePayer = walletProvider.publicKey!

            const confirmationStrategy: any = {
                skipPreflight: true,
                // preflightCommitment: 'processed',
            };

            const hash = await walletProvider.signAndSendTransaction(tx, confirmationStrategy)

            return hash
        }

        return null

    }, [programId, walletProvider, connection, pool])

    const prepaidTokenWithdraw = useCallback(async () => {
        const latestBlockhash = await connection?.getLatestBlockhash();

        const program = new Program<any>(idl, programId, { connection: connection } as any);
        const keys = await getKeys()

        if (!keys) {
            return
        }

        const paidRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("prepaid_record"), keys.pool.toBuffer(), walletProvider.publicKey!.toBuffer()],
            programId
        );

        console.log('keys:', keys)

        const outputAmount = await checkPrePayed()

        console.log('outputAmount:', outputAmount)

        if (outputAmount > 0) {
            const tx: any = await program.methods.prepaidTokenWithdraw(
                new PublicKey('5zKNPpWLaBkt2HMCyxUCyLAEJiUpLd4xYbQyvuh2Bqnm'),
                keys.proxySolAccount
            ).accounts({
                ...keys,
                paidRecord: paidRecord[0]
            }).transaction()
    
            console.log('tx:', tx)
            tx.recentBlockhash = latestBlockhash!.blockhash
            tx.feePayer = walletProvider.publicKey!

            const confirmationStrategy: any = {
                skipPreflight: true,
                // preflightCommitment: 'processed',
            };

            const hash = await walletProvider.signAndSendTransaction(tx, confirmationStrategy)

            return hash
        }

        return null
    }, [])

    const checkPrePayed = useCallback(async () => {
        if (!pool) {
            return false
        }

        const prePaidRecord = PublicKey.findProgramAddressSync(
            [Buffer.from("prepaid_record"), pool[0].toBuffer(), walletProvider.publicKey!.toBuffer()],
            programId
        );

        const program = new Program<any>(idl, programId, { connection: connection } as any);

        try {
            const prePaidRecordData: any = await program.account.prePaidRecord.fetch(prePaidRecord[0])
            return prePaidRecordData.paidAmount.toNumber()
        } catch(e) {
            
        }

        return 0

    }, [walletProvider, programId, connection, pool])

    const getRate = useCallback(async (amountParam: { solAmount?: string, tokenAmount?: string }) => {
        if (pool) {
            const program = new Program<any>(idl, programId, { connection: connection } as any);
            return await _getRate(program, pool[0], amountParam)
        }
    }, [programId, pool, connection])

   

    useEffect(() => {
        if (programId && connection && tokenName && tokenSymbol && loadData && tokenInfo) {
            setTimeout(async () => {
                const userTokenAccount = await _getOrCreateAssociatedTokenAccount(
                    tokenInfo[0],
                    walletProvider.publicKey!,
                    false
                );

                let i = 0
                if (userTokenAccount) {
                    const balance = new Big(Number(userTokenAccount.amount)).div(10 ** tokenDecimals).toString()
                    console.log('balance:', balance)

                    setTokenBalance(balance)
                    return
                }

                setTokenBalance('0')
            }, 10)
        }

    }, [programId, walletProvider, connection, tokenName, tokenSymbol, tokenDecimals, loadData, reFreshBalnace])

    useEffect(() => {
        if (connection) {
            connection.getBalance(walletProvider.publicKey!).then(res => {
                if (res) {
                    setSolBalance(new Big(res).div(10 ** 9).toString())
                } else {
                    setSolBalance('0')
                }
                
            })
        }
        
    }, [connection, walletProvider, reFreshBalnace])

    return {
        getRate,
        minPrice,
        maxPrice,
        buyToken,
        buyTokenWithFixedOutput,
        sellToken,
        sellTokenWithFixedOutput,
        createToken,
        prepaidSolWithdraw,
        prepaidTokenWithdraw,
        tokenBalance,
        solBalance,
        updateBalance: () => { setReFreshBalnace(reFreshBalnace + 1) },
        prePaid,
        checkPrePayed,
    }

}

async function wrapToWSol(provider: any, connection: any, user: PublicKey, wsolAccount: PublicKey, amount: any) {
    const latestBlockhash = await connection?.getLatestBlockhash();

    const transaction = new Transaction({
        recentBlockhash: latestBlockhash!.blockhash,
        feePayer: provider.publicKey!
    }).add(
        SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: wsolAccount,
            lamports: amount, 
        }),
        createSyncNativeInstruction(wsolAccount, TOKEN_PROGRAM_ID)
    );

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

async function _getRate(program: Program, pool: PublicKey, { solAmount, tokenAmount }: { solAmount?: string, tokenAmount?: string }) {
    const poolData: any = await program.account.pool.fetch(pool)

    console.log('poolData:', poolData)

    const poolToken = new Big(poolData!.virtualTokenAmount.toNumber())
    const solToken = new Big(poolData!.virtualWsolAmount.toNumber())

    // buy
    if (solAmount) {
        const _solAmount = new Big(solAmount).mul(1 - 0.01)
        const result = poolToken.mul(_solAmount).div(solToken.plus(_solAmount)).toString()
        return result
    }

    // sell
    if (tokenAmount) {
        const _tokenAmount = new Big(tokenAmount).mul(1 - 0.015)
        const result = solToken.mul(_tokenAmount).div(poolToken.plus(_tokenAmount)).toString()
        return result
    }

    // buy 1% sell 1.5%

    return 0

}
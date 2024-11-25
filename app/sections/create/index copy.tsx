import Tab from '@/app/components/tab'
import styles from './create.module.css'

import CreateNode from './CreateNode'
import PreviewNode from './PreviewNode'

import idl from './meme_launchpad.json'

import type { Connection } from '@reown/appkit-utils/solana';
import {
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
    Transaction,
    sendAndConfirmTransaction,
    Signer,
    CreateLookupTableParams

} from '@solana/web3.js';
import { u64 } from '@solana/buffer-layout-utils';
import { struct, u8, u32, f64, ns64, u48 } from "@solana/buffer-layout";
import { getMint, createSyncNativeInstruction, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddress, getAssociatedTokenAddressSync, getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

import type { Node } from '@/app/components/tab'
import { Button } from 'antd-mobile'
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks'
import { Provider, SolanaAdapter, useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'



const nodes: Node[] = [{
    name: 'Create',
    content: <CreateNode />
}, {
    name: 'Preview',
    content: <PreviewNode />
}]

export default function Create() {
    const { walletProvider } = useAppKitProvider<Provider>('solana')
    const { connection } = useAppKitConnection()
    const { address, caipAddress, isConnected } = useAppKitAccount();
    const { caipNetwork, caipNetworkId, chainId, switchNetwork } = useAppKitNetwork()

    return <div className={styles.main}>
        <div className={styles.title}>
            <div className={styles.titleText}>Create Token</div>
            <div className={styles.saveBtn}>Save</div>
        </div>


        <Button onClick={async () => {
            console.log('walletProvider:', walletProvider, connection)
            await switchNetwork(solanaDevnet)

            const balance = await connection?.getBalance(walletProvider.publicKey!)
            console.log('balance:', balance, chainId, walletProvider.publicKey!)

            let key1 = { pubkey: walletProvider.publicKey!, isSigner: false, isWritable: false }
            let data = Buffer.from([0]);

            let latestBlockhash = await connection?.getLatestBlockhash();


            let transaction = new Transaction();

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: walletProvider.publicKey!,
                    toPubkey: new PublicKey("9WtuBqapwTWYcEDRE2Bvnt14wnmRSJ7htrqnG7aYE8k2"),
                    lamports: LAMPORTS_PER_SOL,
                })
            )

            transaction.recentBlockhash = latestBlockhash!.blockhash;
            transaction.feePayer = walletProvider.publicKey!

            const v = await walletProvider.signAndSendTransaction(transaction)

            //   await sendAndConfirmTransaction(connection!, allocateTransaction, [payer])

        }}>create</Button>

        <Button onClick={async () => {
            const tokenName = 'Zero'
            const tokenSymbol = 'ZERO'

            console.log('walletProvider:', walletProvider, connection)
            await switchNetwork(solanaDevnet)

            const balance = await connection?.getBalance(walletProvider.publicKey!)
            console.log('balance:', balance, chainId, walletProvider.publicKey!)

            // const payer = { pubkey: walletProvider.publicKey!, isSigner: false, isWritable: true }

            const latestBlockhash = await connection?.getLatestBlockhash();

            const transaction = new Transaction({
                recentBlockhash: latestBlockhash!.blockhash,
                feePayer: walletProvider.publicKey!
            });


            let allocateStruct = {
                layout: struct([u64("sol_amount"), f64("max_price"), u8()]),
            };

            console.log('allocateStruct.layout.span: ', allocateStruct.layout)

            let data = Buffer.alloc(allocateStruct.layout.span);


            let layoutFields = {
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

            console.log('data: ', data, newData)
            // return

            const programId = new PublicKey(
                "CcNrTgHd3HE7hj9zrurd1RwBadUVhcThdcY3cJBzAqwY"
            );

            const state = PublicKey.findProgramAddressSync(
                [Buffer.from("launchpad")],
                programId
            )

            const wsol = new PublicKey('So11111111111111111111111111111111111111112');

            const x = await connection?.getAccountInfo(wsol)

            console.log('getAccountInfo:', x)

            console.log('wsol:', wsol, wsol.toString())
            // const mintInfo = await getMint(connection!, wsol)

            const protocolSolAccount = await getOrCreateAssociatedTokenAccount(
                connection!,
                walletProvider as any,
                wsol,
                state[0],
                true
            );

            const pool = PublicKey.findProgramAddressSync(
                [Buffer.from("token_info"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
                programId
            );

            const tokenInfo = PublicKey.findProgramAddressSync(
                [Buffer.from("mint"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
                programId
            );

            console.log('programId:', programId)

            const userSolAccount = await getOrCreateAssociatedTokenAccount(
                connection!,
                walletProvider as any,
                wsol,
                walletProvider.publicKey!,
                true
            );

            // const associatedToken = getAssociatedTokenAddressSync(
            //     wsol,
            //     walletProvider.publicKey!,
            //     false,
            //     TOKEN_PROGRAM_ID,
            //     ASSOCIATED_TOKEN_PROGRAM_ID,
            // );

            // const xtransaction = new Transaction(
            //     {
            //         recentBlockhash: latestBlockhash!.blockhash,
            //         feePayer: walletProvider.publicKey!
            //     }
            // ).add(
            //     createAssociatedTokenAccountInstruction(
            //         walletProvider.publicKey!,
            //         associatedToken,
            //         walletProvider.publicKey!,
            //         wsol,
            //         TOKEN_PROGRAM_ID,
            //         ASSOCIATED_TOKEN_PROGRAM_ID,
            //     ),
            // );

            // const v = await walletProvider.signAndSendTransaction(xtransaction)

            // console.log(v)


            console.log('userSolAccount:', userSolAccount)

            const poolSolAccount = await getOrCreateAssociatedTokenAccount(
                connection!,
                walletProvider as any,
                wsol,
                pool[0],
                true
            );

            console.log('poolSolAccount: ', poolSolAccount)

            // const associatedToken = getAssociatedTokenAddressSync(
            //     tokenInfo[0],
            //     walletProvider.publicKey!,
            //     false,
            //     TOKEN_PROGRAM_ID,
            //     ASSOCIATED_TOKEN_PROGRAM_ID,
            // );

            // const xtransaction = new Transaction(
            //     {
            //         recentBlockhash: latestBlockhash!.blockhash,
            //         feePayer: walletProvider.publicKey!
            //     }
            // ).add(
            //     createAssociatedTokenAccountInstruction(
            //         walletProvider.publicKey!,
            //         associatedToken,
            //         walletProvider.publicKey!,
            //         tokenInfo[0],
            //         TOKEN_PROGRAM_ID,
            //         ASSOCIATED_TOKEN_PROGRAM_ID,
            //     ),
            // );

            // const v = await walletProvider.signAndSendTransaction(xtransaction)

            // console.log(v)

            // return


            const userTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection!,
                walletProvider as any,
                tokenInfo[0],
                walletProvider.publicKey!,
                true
            );

            console.log('userTokenAccount: ', userTokenAccount)

            const poolTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection!,
                walletProvider as any,
                tokenInfo[0],
                pool[0],
                true
            );

            await wrapToWSol(walletProvider, connection!, walletProvider.publicKey!, userSolAccount.address, 20000000)

            // const poolSolAccount = await getTokenAccount(provider, payer, wsolMint.toString(), pool.pda)

            console.log('poolTokenAccount: ', poolTokenAccount)

            // return

            transaction.add(
                new TransactionInstruction({
                    keys: [
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

                    ],
                    programId,
                    data: newData,
                })
            )

            // const v = await walletProvider.signAndSendTransaction(transaction)

            // console.log('v: ', v)

            // const program = new Program<any>(idl, walletProvider as any);

            // console.log('program:', program)

            // const hhh = await program.methods.buyToken(new BN(6000000), new BN(100000), null).accounts({
            //     launchpad: state[0],
            //     protocolSolAccount: protocolSolAccount.address,
            //     referralSolAccount: protocolSolAccount.address,
            //     pool: pool[0],
        
            //     wsolMint: wsol,
            //     userWsolAccount: userSolAccount.address,
            //     poolWsolAccount: poolSolAccount.address,
        
            //     tokenMint: tokenInfo[0],
            //     userTokenAccount: userTokenAccount.address,
            //     poolTokenAccount: poolTokenAccount.address,
        
            //     tokenProgram: TOKEN_PROGRAM_ID,
            //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            //     user: walletProvider.publicKey!,
            //     systemProgram: SystemProgram.programId,
            // }).transaction()

            // hhh.feePayer = walletProvider.publicKey!
            // hhh.recentBlockhash = latestBlockhash!.blockhash

            // console.log(transaction, hhh)

            // const v = await walletProvider.signAndSendTransaction(hhh)

            const v = await walletProvider.signAndSendTransaction(transaction)

        }}>buy</Button>

        <Button onClick={async () => {
             const tokenName = 'Zero'
             const tokenSymbol = 'ZERO'
 
             console.log('walletProvider:', walletProvider, connection)
             await switchNetwork(solanaDevnet)
 
             const balance = await connection?.getBalance(walletProvider.publicKey!)
             console.log('balance:', balance, chainId, walletProvider.publicKey!)
 
             // const payer = { pubkey: walletProvider.publicKey!, isSigner: false, isWritable: true }
 
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
             // return
 
             const programId = new PublicKey(
                 "CcNrTgHd3HE7hj9zrurd1RwBadUVhcThdcY3cJBzAqwY"
             );
 
             const state = PublicKey.findProgramAddressSync(
                 [Buffer.from("launchpad")],
                 programId
             )
 
             const wsol = new PublicKey('So11111111111111111111111111111111111111112');
 
             const x = await connection?.getAccountInfo(wsol)
 
             console.log('getAccountInfo:', x)
 
             console.log('wsol:', wsol, wsol.toString())
             // const mintInfo = await getMint(connection!, wsol)
 
             const protocolSolAccount = await getOrCreateAssociatedTokenAccount(
                 connection!,
                 walletProvider as any,
                 wsol,
                 state[0],
                 true
             );
 
             const pool = PublicKey.findProgramAddressSync(
                 [Buffer.from("token_info"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
                 programId
             );
 
             const tokenInfo = PublicKey.findProgramAddressSync(
                 [Buffer.from("mint"), Buffer.from(tokenName), Buffer.from(tokenSymbol)],
                 programId
             );
 
             console.log('programId:', programId)
 
             const userSolAccount = await getOrCreateAssociatedTokenAccount(
                 connection!,
                 walletProvider as any,
                 wsol,
                 walletProvider.publicKey!,
                 true
             );
 
             // const associatedToken = getAssociatedTokenAddressSync(
             //     wsol,
             //     walletProvider.publicKey!,
             //     false,
             //     TOKEN_PROGRAM_ID,
             //     ASSOCIATED_TOKEN_PROGRAM_ID,
             // );
 
             // const xtransaction = new Transaction(
             //     {
             //         recentBlockhash: latestBlockhash!.blockhash,
             //         feePayer: walletProvider.publicKey!
             //     }
             // ).add(
             //     createAssociatedTokenAccountInstruction(
             //         walletProvider.publicKey!,
             //         associatedToken,
             //         walletProvider.publicKey!,
             //         wsol,
             //         TOKEN_PROGRAM_ID,
             //         ASSOCIATED_TOKEN_PROGRAM_ID,
             //     ),
             // );
 
             // const v = await walletProvider.signAndSendTransaction(xtransaction)
 
             // console.log(v)
 
 
             console.log('userSolAccount:', userSolAccount)
 
             const poolSolAccount = await getOrCreateAssociatedTokenAccount(
                 connection!,
                 walletProvider as any,
                 wsol,
                 pool[0],
                 true
             );
 
             console.log('poolSolAccount: ', poolSolAccount)
 
             // const associatedToken = getAssociatedTokenAddressSync(
             //     tokenInfo[0],
             //     walletProvider.publicKey!,
             //     false,
             //     TOKEN_PROGRAM_ID,
             //     ASSOCIATED_TOKEN_PROGRAM_ID,
             // );
 
             // const xtransaction = new Transaction(
             //     {
             //         recentBlockhash: latestBlockhash!.blockhash,
             //         feePayer: walletProvider.publicKey!
             //     }
             // ).add(
             //     createAssociatedTokenAccountInstruction(
             //         walletProvider.publicKey!,
             //         associatedToken,
             //         walletProvider.publicKey!,
             //         tokenInfo[0],
             //         TOKEN_PROGRAM_ID,
             //         ASSOCIATED_TOKEN_PROGRAM_ID,
             //     ),
             // );
 
             // const v = await walletProvider.signAndSendTransaction(xtransaction)
 
             // console.log(v)
 
             // return
 
 
             const userTokenAccount = await getOrCreateAssociatedTokenAccount(
                 connection!,
                 walletProvider as any,
                 tokenInfo[0],
                 walletProvider.publicKey!,
                 true
             );
 
             console.log('userTokenAccount: ', userTokenAccount)
 
             const poolTokenAccount = await getOrCreateAssociatedTokenAccount(
                 connection!,
                 walletProvider as any,
                 tokenInfo[0],
                 pool[0],
                 true
             );
 
            //  await wrapToWSol(walletProvider, connection!, walletProvider.publicKey!, userSolAccount.address, 20000000)
 
             // const poolSolAccount = await getTokenAccount(provider, payer, wsolMint.toString(), pool.pda)
 
             console.log('poolTokenAccount: ', poolTokenAccount)
 
             // return
 
             transaction.add(
                 new TransactionInstruction({
                     keys: [
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
 
                     ],
                     programId,
                     data: newData,
                 })
             )
 
             // const v = await walletProvider.signAndSendTransaction(transaction)
 
             // console.log('v: ', v)
 
             // const program = new Program<any>(idl, walletProvider as any);
 
             // console.log('program:', program)
 
             // const hhh = await program.methods.buyToken(new BN(6000000), new BN(100000), null).accounts({
             //     launchpad: state[0],
             //     protocolSolAccount: protocolSolAccount.address,
             //     referralSolAccount: protocolSolAccount.address,
             //     pool: pool[0],
         
             //     wsolMint: wsol,
             //     userWsolAccount: userSolAccount.address,
             //     poolWsolAccount: poolSolAccount.address,
         
             //     tokenMint: tokenInfo[0],
             //     userTokenAccount: userTokenAccount.address,
             //     poolTokenAccount: poolTokenAccount.address,
         
             //     tokenProgram: TOKEN_PROGRAM_ID,
             //     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
             //     user: walletProvider.publicKey!,
             //     systemProgram: SystemProgram.programId,
             // }).transaction()
 
             // hhh.feePayer = walletProvider.publicKey!
             // hhh.recentBlockhash = latestBlockhash!.blockhash
 
             // console.log(transaction, hhh)
 
             // const v = await walletProvider.signAndSendTransaction(hhh)
 
             const v = await walletProvider.signAndSendTransaction(transaction)
        }}>sell</Button>

        <Tab nodes={nodes} />


    </div>
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

// function sighash(nameSpace: string, ixName: string): Buffer {
//     let preimage = `${nameSpace}:${ixName}`;
//     return Buffer.from(sha256.digest(preimage)).slice(0, 8);
//   }
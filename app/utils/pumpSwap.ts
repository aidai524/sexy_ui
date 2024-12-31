import { ComputeBudgetProgram, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createTransaction, sendAndConfirmTransactionWrapper, bufferFromUInt64 } from '../hooks/utils';


import { GLOBAL, FEE_RECIPIENT, SYSTEM_PROGRAM_ID, RENT, PUMP_FUN_ACCOUNT, PUMP_FUN_PROGRAM, ASSOC_TOKEN_ACC_PROG } from '@/app/utils/config';

export async function pumpFunBuy(mintStr: string, solIn: number, slippageDecimal: number = 0.25, connection: Connection, walletProvider: any) {
    try {

        const coinData = await getCoinData(mintStr);
        if (!coinData) {
            throw 'Failed to retrieve coin data...';
        }

        const owner = walletProvider.publicKey;
        const mint = new PublicKey(mintStr);

        const txBuilder = new Transaction();

        const tokenAccountAddress = await getAssociatedTokenAddress(
            mint,
            owner,
            false
        );

        console.log('tokenAccountAddress:', tokenAccountAddress)

        let tokenAccountInfo
        try {
            tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);
        } catch (e) { }


        let tokenAccount: PublicKey;
        if (!tokenAccountInfo) {
            txBuilder.add(
                createAssociatedTokenAccountInstruction(
                    owner,
                    tokenAccountAddress,
                    owner,
                    mint
                )
            );
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }

        const solInLamports = solIn * LAMPORTS_PER_SOL;
        const tokenOut = Math.floor(solInLamports * coinData["virtual_token_reserves"] / coinData["virtual_sol_reserves"]);

        const solInWithSlippage = solIn * (1 + slippageDecimal);
        const maxSolCost = Math.floor(solInWithSlippage * LAMPORTS_PER_SOL);
        const ASSOCIATED_USER = tokenAccount;
        const USER = owner;
        const BONDING_CURVE = new PublicKey(coinData['bonding_curve']);
        const ASSOCIATED_BONDING_CURVE = new PublicKey(coinData['associated_bonding_curve']);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: BONDING_CURVE, isSigner: false, isWritable: true },
            { pubkey: ASSOCIATED_BONDING_CURVE, isSigner: false, isWritable: true },
            { pubkey: ASSOCIATED_USER, isSigner: false, isWritable: true },
            { pubkey: USER, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: RENT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false },
        ];


        console.log('keys:', keys)

        const data = Buffer.concat([
            bufferFromUInt64("16927863322537952870"),
            bufferFromUInt64(tokenOut),
            bufferFromUInt64(maxSolCost)
        ]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });
        txBuilder.add(instruction);


        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1000000,
        });
      
        txBuilder.add(modifyComputeUnits)

        const hash = await walletProvider.signAndSendTransaction(txBuilder)

        console.log('hash', hash)

        return hash

    } catch (error) {
        console.log(error);
    }
}


export async function pumpFunSell(mintStr: string, tokenBalance: number, slippageDecimal: number = 0.25, connection: Connection, walletProvider: any) {
    try {
        const coinData = await getCoinData(mintStr);
        if (!coinData) {
            throw 'Failed to retrieve coin data...';
            return;
        }

        const owner = walletProvider.publicKey;
        const mint = new PublicKey(mintStr);
        const txBuilder = new Transaction();

        const tokenAccountAddress = await getAssociatedTokenAddress(
            mint,
            owner,
            false
        );

        const tokenAccountInfo = await connection.getAccountInfo(tokenAccountAddress);

        let tokenAccount: PublicKey;
        if (!tokenAccountInfo) {
            txBuilder.add(
                createAssociatedTokenAccountInstruction(
                    owner,
                    tokenAccountAddress,
                    owner,
                    mint
                )
            );
            tokenAccount = tokenAccountAddress;
        } else {
            tokenAccount = tokenAccountAddress;
        }

        const minSolOutput = Math.floor(tokenBalance! * (1 - slippageDecimal) * coinData["virtual_sol_reserves"] / coinData["virtual_token_reserves"]);

        const keys = [
            { pubkey: GLOBAL, isSigner: false, isWritable: false },
            { pubkey: FEE_RECIPIENT, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: false },
            { pubkey: new PublicKey(coinData['bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(coinData['associated_bonding_curve']), isSigner: false, isWritable: true },
            { pubkey: tokenAccount, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: false, isWritable: true },
            { pubkey: SYSTEM_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: ASSOC_TOKEN_ACC_PROG, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_ACCOUNT, isSigner: false, isWritable: false },
            { pubkey: PUMP_FUN_PROGRAM, isSigner: false, isWritable: false }
        ];

        const data = Buffer.concat([
            bufferFromUInt64("12502976635542562355"),
            bufferFromUInt64(tokenBalance),
            bufferFromUInt64(minSolOutput)
        ]);

        const instruction = new TransactionInstruction({
            keys: keys,
            programId: PUMP_FUN_PROGRAM,
            data: data
        });
        txBuilder.add(instruction);

        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
            units: 1000000,
        });
      
        txBuilder.add(modifyComputeUnits)

        const hash = await walletProvider.signAndSendTransaction(txBuilder)

        console.log('hash', hash)

        return hash
    }

    catch (error) {
        console.log(error)
    }
}


export async function getCoinData(mintStr: string) {
    const url = `/api/pump?token=${mintStr}`;
    return fetch(url).then(res => res.json())
}
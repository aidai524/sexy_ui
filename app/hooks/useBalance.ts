import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useAccount } from "./useAccount";
import Big from "big.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export default function useBalance({ reFreshBalnace, mint, tokenDecimals }
    : { mint?: string, tokenDecimals?: number, reFreshBalnace: number }) {
    const { connection } = useConnection();
    const { walletProvider } = useAccount();

    const [solBalance, setSolBalance] = useState('0')
    const [tokenBalance, setTokenBalance] = useState('0')

    useEffect(() => {
        if (connection && walletProvider.publicKey) {
            connection.getBalance(walletProvider.publicKey!).then((res) => {
                if (res) {
                    setSolBalance(new Big(res).div(10 ** 9).toString());
                } else {
                    setSolBalance("0");
                }
            });
        }
    }, [connection, walletProvider]);

    useEffect(() => {
        if (connection && mint && tokenDecimals) {
            const mintAddress = new PublicKey(mint)

            try {
                const associatedToken = getAssociatedTokenAddressSync(
                    mintAddress,
                    walletProvider.publicKey!,
                    true,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                );

                getAccount(
                    connection,
                    associatedToken,
                    undefined,
                    TOKEN_PROGRAM_ID
                ).then(userToken => {
                    console.log('userAccount:', userToken)
                    if (userToken && userToken.amount) {
                        const balance = new Big(Number(userToken.amount))
                                    .div(10 ** tokenDecimals)
                                    .toString();

                        setTokenBalance(balance)
                    }
                }).catch(() => {
                    setTokenBalance('0')
                })
            } catch (e) {
                setTokenBalance('0')
            }
        }
    }, [
        walletProvider,
        connection,
        mint,
        tokenDecimals,
        reFreshBalnace
    ]);

    return {
        solBalance,
        tokenBalance,
    }
}

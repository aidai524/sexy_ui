import { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { defaultAvatar } from "@/app/utils/config";
import { getTokenMeta } from '@/app/utils/solanaScanApi';

export function useCopyTokenInfos(tokens: any[] | undefined) {
    const { connection } = useConnection();
    const [tokenInfos, setTokenInfos] = useState<{[key: string]: any}>({});

    useEffect(() => {
        const fetchTokenInfos = async () => {
            if (tokens) {
                const infos: {[key: string]: any} = {};
                for (const item of tokens) {
                    infos[item.token] = await getTokenInfo(item.token);
                }
                setTokenInfos(infos);
            }
        };
        fetchTokenInfos();
    }, [tokens, connection]);

    const getTokenInfo = async (address: string) => {
        try {
            if (process.env.NEXT_PUBLIC_NET === "Devnet") {
                const tokenSupply = await connection.getTokenSupply(
                    new PublicKey(address),
                    "confirmed"
                );
                return {
                    supply: tokenSupply.value.uiAmount || 0,
                    icon: defaultAvatar,
                    symbol: 'token'
                };
            } else {
                const tokenInfo = await getTokenMeta(address);
                return {
                    supply: tokenInfo.data.supply,
                    icon: tokenInfo.data.icon || defaultAvatar,
                    symbol: tokenInfo.data.symbol || 'token'
                };
            }
        } catch (error) {
            return {
                supply: 0,
                icon: defaultAvatar,
                symbol: 'token'
            };
        }
    };

    return tokenInfos;
}
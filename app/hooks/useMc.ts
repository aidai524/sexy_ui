import { useEffect, useState } from "react";
import { getTokenMeta } from "../utils/solanaScanApi";

interface Props {
    tokenAddress: string | undefined;
    disable: boolean;
}

export default function useMc({ tokenAddress, disable = true }: Props) {
    const [mc, setMc] = useState(0)

    useEffect(() => {
        console.log('disable:', disable, tokenAddress)
        if (tokenAddress && !disable) {
            getTokenMeta(tokenAddress).then(res => {
                setMc(res.data.market_cap)
            })
        }
        
    }, [tokenAddress, disable])

    return {
        mc
    }
}
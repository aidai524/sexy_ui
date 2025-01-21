import { useEffect, useState } from "react";
import { getTokenMeta } from "../utils/solanaScanApi";
import { useConfig } from "../store/useConfig";
import { getMint } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface Props {
  tokenAddress: string | undefined;
  disable: boolean;
}

const wsol = "So11111111111111111111111111111111111111112";

export default function useMc({ tokenAddress, disable = true }: Props) {
  const [mc, setMc] = useState(0);
  const { connection } = useConnection();

  useEffect(() => {
    if (tokenAddress && !disable) {
      fetch(`https://fe-api.jup.ag/api/v1/tokens/${tokenAddress}?quote_address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
      .then(res => res.json())
      .then(data => {
        if (data.totalSupply && data.priceUsd) {
          console.log("mc:", data.name, data.totalSupply * data.priceUsd);
          setMc(data.totalSupply * data.priceUsd);
        }
      })
      .catch((e) => {
        setMc(0);
      });


      // Promise.all([
      //   getMint(connection, new PublicKey(tokenAddress)),
      //   fetch(`https://api.jup.ag/price/v2?ids=${tokenAddress},${wsol}`).then(
      //     (res) => res.json()
      //   )
      // ])
      //   .then(([mintInfo, priceInfo]) => {
      //     // console.log(mintInfo, priceInfo)

      //     const mc =
      //       (Number(mintInfo.supply) *
      //         Number(priceInfo.data[tokenAddress].price)) /
      //       10 ** mintInfo.decimals;
      //     setMc(mc);
      //   })
      //   .catch((e) => {
      //     setMc(0);
      //   });
    }
  }, [tokenAddress, disable]);

  

  return {
    mc
  };
}

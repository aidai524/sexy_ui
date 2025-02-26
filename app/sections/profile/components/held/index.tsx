import { useCallback, useEffect, useState } from "react";
import styles from "./held.module.css";
import { getTokenByHolder, getTokenMeta } from "@/app/utils/solanaScanApi";
import { useAccount } from "@/app/hooks/useAccount";
import Big from "big.js";
import { httpGet, simplifyNum } from "@/app/utils";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";
import Empty from "@/app/components/empty";
import { useRouter } from "next/navigation";
import { numberFormatter } from "@/app/utils/common";
import Media from "@/app/components/thumbnail/media";
import HoldItem from "./holdItem";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";
import { Metaplex } from "@metaplex-foundation/js";
import Loading from "@/app/loading";

const pageSize = 40;

export default function Held({ from, address }: any) {
  const router = useRouter();
  // const { address } = useAccount()
  const [list, setList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const [tokenPrice, setTokenPrice] = useState<any>({});
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const getTokenPrice = useCallback(
    async (address: string[]) => {
      if (!address?.length) return;
      const v = await httpGet(
        `/token/price/list?token_list=${encodeURIComponent(address.join(","))}`
      );
      if (v.code === 0 && v.data) {
        setTokenPrice({
          ...tokenPrice,
          ...v.data
        });
      }
    },
    [tokenPrice]
  );

  const loadMore = useCallback(async () => {
    if (address) {
      setIsLoading(true);
      const res = await connection.getTokenAccountsByOwner(new PublicKey(address), {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })
      console.log('res:', res)
      const tokenList = res.value.map((account, index) => {
        const data = AccountLayout.decode(account.account.data);
        // console.log(`Token ${index + 1}:`);
        console.log('data:', data)
        // console.log("  Mint Address:", new PublicKey(data.mint).toBase58());
        // console.log("  Token Account:", account.pubkey.toBase58());
        // console.log("  Balance:", Number(data.amount));
        return {
          ...data,
          token_account: account.pubkey.toBase58(),
        }
      }).filter((item: any) => Number(item.amount) > 0)

      const mintList = tokenList.map((data) => {
        return new PublicKey(data.mint)
      })

      const metaplex = Metaplex.make(connection);
      
      // const metadataList = await metaplex.nfts().findAllByMintList({ mints: mintList })

      // console.log('metadataList:', metadataList)

      const tokenListWithMetadata = await Promise.all(tokenList.map(async token => {

        const metadataAccount = await metaplex
                .nfts()
                .findByMint({ mintAddress: token.mint });
        // const metadata = metadataList.find((item: any) => item.mintAddress.toBase58() === token.mint.toBase58())
        return {
          // ...token,
          // metadata,
          token_address: token.mint.toBase58(),
          token_account: token.token_account,
          token_balance: Number(token.amount),
          token_icon: metadataAccount?.uri,
          token_name: metadataAccount?.name,
          token_symbol: metadataAccount?.symbol,
          token_decimals: metadataAccount?.mint.decimals, 
        }
      }))

       console.log('tokenListWithMetadata:', tokenListWithMetadata)

      await getTokenPrice(tokenListWithMetadata.map((item) => item.token_address));

      setList(tokenListWithMetadata);
      setIsLoading(false);

      // return getTokenByHolder(address, pageIndex, pageSize).then((res) => {
      //   const newList = [...list, ...(res.data || [])];
      //   setList(newList);
      //   const newTokenInfo = {
      //     ...res.metadata.tokens,
      //     ...tokenInfo
      //   };
      //   setTokenInfo(newTokenInfo);

      //   getTokenPrice(newList.map((item) => item.token_address));

      //   if (res.data) {
      //     if (res.data.length < pageSize) {
      //       setHasMore(false);
      //     } else {
      //       setPageIndex(pageIndex + 1);
      //       setHasMore(true);
      //     }
      //   }
      // });
    }
  }, [address, list, tokenInfo, pageIndex]);

  useEffect(() => {
    loadMore()
  }, [address]);

  if (isLoading) {
    return <div style={{ paddingTop: 116 }} ><Loading /></div>
  }


  if (list.length === 0) {
    return (
      <div style={{ paddingTop: 116 }}>
        <Empty text="No meme held yet" />
      </div>
    );
  }


  return (
    <div
      className={styles.main}
      style={{
        backgroundColor:
          from === "page" ? "transparent" : "rgba(255, 255, 255, 0.08)"
      }}
    >
      {list.map((item: any) => {
        return <HoldItem key={item.token_address} item={item} from={from} tokenInfo={tokenInfo} tokenPrice={tokenPrice} />;
      })}

      {/* <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
    </div>
  );
}

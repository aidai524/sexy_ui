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

const pageSize = 40;

export default function Held({ from, address }: any) {
  const router = useRouter();
  // const { address } = useAccount()
  const [list, setList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [tokenInfo, setTokenInfo] = useState<any>({});
  const [tokenPrice, setTokenPrice] = useState<any>({});

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
      return getTokenByHolder(address, pageIndex, pageSize).then((res) => {
        const newList = [...list, ...(res.data || [])];
        setList(newList);
        const newTokenInfo = {
          ...res.metadata.tokens,
          ...tokenInfo
        };
        setTokenInfo(newTokenInfo);

        getTokenPrice(newList.map((item) => item.token_address));

        if (res.data) {
          if (res.data.length < pageSize) {
            setHasMore(false);
          } else {
            setPageIndex(pageIndex + 1);
            setHasMore(true);
          }
        }
      });
    }
    setHasMore(false);
  }, [address, list, tokenInfo, pageIndex]);

  useEffect(() => {
    // loadMore()
  }, [address]);

  if (list.length === 0 && !hasMore) {
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

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import styles from "./held.module.css";
import { getTokenByHolder } from "@/app/utils/solanaScanApi";
import { useAccount } from "@/app/hooks/useAccount";
import Big from "big.js";
import { simplifyNum } from "@/app/utils";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";

const pageSize = 40

export default function Held({ from }: any) {
  const { address } = useAccount()
  const [list, setList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const [tokenInfo, setTokenInfo] = useState<any>({})

  const loadMore = useCallback(async () => {
    if (address) {
      return getTokenByHolder(address, pageIndex, pageSize).then(res => {
        const newList = [
          ...list,
          ...(res.data || [])
        ]

        setList(newList)
        const newTokenInfo = {
          ...res.metadata.tokens,
          ...tokenInfo,
        }
        setTokenInfo(newTokenInfo)

        if (res.data) {
          if (res.data.length < pageSize) {
            setHasMore(false)
          } else {
            setPageIndex(pageIndex + 1)
            setHasMore(true)
          }
        }
        
      })
    }
    
  }, [address, list, tokenInfo, pageIndex])

  useEffect(() => {
    // loadMore()
  }, [address])

  return (
    <div
      className={styles.main}
      style={{
        backgroundColor:
          from === "page" ? "transparent" : "rgba(255, 255, 255, 0.08)"
      }}
    >
      {list.map((item: any) => {
        return (
          <div
            className={`${styles.heldToken} ${
              from === "page" && styles.PageHeldToken
            }`}
            key={item.token_address}
          >
            <div className={styles.tokenMsg}>
              <img
                className={styles.tokenImg}
                src={tokenInfo[item.token_address].token_icon}
              />
              <div className={styles.tokenNames}>
                <div className={styles.name}>{ tokenInfo[item.token_address].token_name }</div>
                <div className={styles.viewCoin} onClick={() => {
                  window.open('https://solscan.io/account/' + item.token_account)
                }}>
                  <span className={styles.viewCoinText}>View Coin</span>
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z"
                      fill="#7E8A93"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.tokenValue}>
              <div className={styles.tokenAmount}>{ (new Big(item.amount).div(10 ** item.token_decimals).toNumber()) }</div>
              {/* <div className={styles.solPrice}>0.005 SOL</div> */}
            </div>
          </div>
        );
      })}

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import Level from "../level/simple";
import styles from "./index.module.css";
import { useAccount } from "@/app/hooks/useAccount";
import SexInfiniteScroll from "../sexInfiniteScroll";
import { getHoldersByToken } from "@/app/utils/solanaScanApi";
import { formatAddress, simplifyNum } from "@/app/utils";
import Big from "big.js";

const pageSize = 40

export default function Holder({ from, address, style = {} }: any) {
    const [list, setList] = useState<any[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [pageIndex, setPageIndex] = useState(1)
  
    const loadMore = useCallback(async () => {
      if (address) {
        return getHoldersByToken(address, pageIndex, pageSize).then(res => {
          console.log('res:::', res)

          const newList = [
            ...list,
            ...(res.items || [])
          ]
  
          setList(newList)
        
          if (res.items) {
            if (res.items.length < pageSize) {
              setHasMore(false)
            } else {
              setPageIndex(pageIndex + 1)
              setHasMore(true)
            }
          }
          
        })
      }
      
    }, [address, list, pageIndex])
  
    useEffect(() => {
      // loadMore()
    }, [address])



  return (
    <div
      style={style}
      className={`${styles.distributionArea} ${
        from === "laptop-home" ? styles.LaptopList : ""
      }`}
    >
      <div className={styles.distributionTitle}>Holder Distribution</div>
      <div className={`${styles.list} `}>
        {
          list.map(item => {
            return <div key={item.owner} className={styles.item}>
            <div className={styles.itemContent}>
              <div style={{ minWidth: 20 }}>{ item.rank }.</div>
              <div className={styles.UserName}>
                <span>{ formatAddress(item.address) }</span>
                <Level level={6} />
              </div>
            </div>
  
            <div className={styles.itemPercent}>{ simplifyNum(new Big(item.amount).div(10 ** item.decimals).toNumber()) }</div>
          </div>
          })
        }
        
      </div>

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

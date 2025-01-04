import { useCallback, useEffect, useState } from "react";
import Level from "../level/simple";
import styles from "./index.module.css";
import { useAccount } from "@/app/hooks/useAccount";
import SexInfiniteScroll from "../sexInfiniteScroll";
import { getHoldersByToken, getTokenMeta } from "@/app/utils/solanaScanApi";
import { formatAddress, httpGet, simplifyNum } from "@/app/utils";
import Big from "big.js";
import { accessSync } from "node:fs";

const pageSize = 40

export default function Holder({ from, address, style = {} }: any) {
  const [list, setList] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const [supply, setSupply] = useState(1)

  const loadMore = useCallback(async () => {
    if (address) {
      const res = await getHoldersByToken(address, pageIndex, pageSize)

      if (res.items && res.items.length) {
        const addressList = res.items.map((item: any) => item.address).join(',')
        const addressObj = await getUserInfoByAddressList(addressList)
        res.items.forEach((item: any) => {
          if (addressObj[item.address]) {
            Object.assign(item, {
              flipUser: addressObj[item.address]
            })
          }
        })
      }

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

    }

  }, [address, list, pageIndex])

  const getTokenInfo = useCallback(async () => {
    if (address) {
      const tokenInfo = await getTokenMeta(address)
      setSupply(tokenInfo.data.supply)
    }

  }, [address])

  const getUserInfoByAddressList = useCallback(async (addressList: string) => {
    const addressObj: any = {}
    const res: any = httpGet('/account/address_list?address_List=' + addressList)
    if (res.code === 0) {
      const { data } = res
      data.forEach((item: any) => {
        addressObj[item.address] = item
      })
      return addressObj
    }

    return addressObj
  }, [])

  useEffect(() => {
    getTokenInfo()
  }, [address])

  return (
    <div
      style={style}
      className={`${styles.distributionArea} ${from === "laptop-home" ? styles.LaptopList : ""
        }`}
    >
      <div className={styles.distributionTitle}>Holder Distribution</div>
      <div className={`${styles.list} `}>
        {
          list.map(item => {
            return <div key={item.owner} className={styles.item}>
              <div className={styles.itemContent}>
                <div style={{ minWidth: 20 }}>{item.rank}.</div>
                <div className={styles.UserName}>
                  <span>{formatAddress(item.address)}</span>
                  <Level level={6} />
                </div>
              </div>

              <div className={styles.itemPercent}>{new Big(item.amount).div(supply).mul(100).toFixed(2)}%</div>
            </div>
          })
        }

      </div>

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

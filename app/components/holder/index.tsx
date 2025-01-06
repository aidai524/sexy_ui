import { useCallback, useEffect, useState } from "react";
import Level from "../level/simple";
import styles from "./index.module.css";
import SexInfiniteScroll from "../sexInfiniteScroll";
import Empty from "../empty";
import { getHoldersByToken, getTokenMeta } from "@/app/utils/solanaScanApi";
import { formatAddress, httpGet, simplifyNum } from "@/app/utils";
import Big from "big.js";
import { defaultAvatar } from "@/app/utils/config";
import { numberFormatter } from "@/app/utils/common";

const pageSize = 40;

export default function Holder({ from, address, showAvatar, style = {} }: any) {
  const [list, setList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [supply, setSupply] = useState(1);

  const loadMore = useCallback(async () => {
    if (!address) return;
    if (pageIndex === 1) setIsLoading(true);
    try {
      const res = await getHoldersByToken(address, pageIndex, pageSize);

      if (res.items && res.items.length) {
        const addressList = res.items.map((item: any) => item.owner).join(",");
        const addressObj = await getUserInfoByAddressList(addressList);

        res.items.forEach((item: any) => {
          if (addressObj[item.address]) {
            Object.assign(item, {
              flipUser: addressObj[item.owner]
            });
          }
        });
      }

      const newList = [...list, ...(res.items || [])];

      setList(newList);

      if (res.items) {
        if (res.items.length < pageSize) {
          setHasMore(false);
        } else {
          setPageIndex(pageIndex + 1);
          setHasMore(true);
        }
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [address, list, pageIndex]);

  const getTokenInfo = useCallback(async () => {
    if (address) {
      const tokenInfo = await getTokenMeta(address);
      setSupply(tokenInfo.data.supply);
    }
  }, [address]);

  const getUserInfoByAddressList = useCallback(async (addressList: string) => {
    const addressObj: any = {};
    const res: any = await httpGet(
      "/account/address_list?address_List=" + addressList
    );

    if (res.code === 0) {
      const { data } = res;
      data.forEach((item: any) => {
        addressObj[item.address] = item;
      });
      return addressObj;
    }

    return addressObj;
  }, []);

  useEffect(() => {
    getTokenInfo();
  }, [address]);

  return (
    <div
      style={style}
      className={`${styles.distributionArea} ${
        from === "laptop-home" ? styles.LaptopList : ""
      }`}
    >
      <div className={styles.distributionTitle}>Holder Distribution</div>
      <div className={`${styles.list} `}>
        {list.map((item) => {
          return (
            <div key={item.owner} className={styles.item}>
              {showAvatar ? (
                <div className={styles.avatarContent}>
                  <div style={{ minWidth: 20 }}>{item.rank}.</div>
                  <div className={styles.avatar}>
                    <img
                      className={styles.avatrImg}
                      src={item.flipUser?.icon || defaultAvatar}
                    />
                  </div>
                  <div className={styles.nameContent}>
                    <div className={styles.nameLevel}>
                      <span>{formatAddress(item.owner)}</span>
                      {item.flipUser && <Level level={item.flipUser?.level} />}
                    </div>
                    <div className={styles.followers}>
                      {item.flipUser?.followers || 0} followers
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.itemContent}>
                  <div style={{ minWidth: 20 }}>{item.rank}.</div>
                  <div className={styles.UserName}>
                    <span>{formatAddress(item.owner)}</span>
                    {item.flipUser && <Level level={item.flipUser?.level} />}
                  </div>
                </div>
              )}

              <div className={styles.itemPercent}>
                {new Big(item.amount).div(supply).mul(100).toNumber() > 99.99
                  ? "<100"
                  : numberFormatter(
                      new Big(item.amount).div(supply).mul(100).toNumber(),
                      2,
                      true,
                      { isShort: true }
                    )}
                %
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 && !isLoading && (
        <div
          style={{
            marginTop: 30
          }}
        >
          <Empty text="No holders" />
        </div>
      )}
      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

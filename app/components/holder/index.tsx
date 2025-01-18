import { useCallback, useEffect, useState } from "react";
import Level from "../level/simple";
import styles from "./index.module.css";
import SexInfiniteScroll from "../sexInfiniteScroll";
import Empty from "../empty";
import { getHoldersByToken, getTokenMeta } from "@/app/utils/solanaScanApi";
import { formatAddress, httpGet } from "@/app/utils";
import Big from "big.js";
import { defaultAvatar } from "@/app/utils/config";
import { numberFormatter } from "@/app/utils/common";
import { useDebounceFn } from "ahooks";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { fail } from "@/app/utils/toast";

const pageSize = 40;

export default function Holder({ from, address, showAvatar, style = {} }: any) {
  const [list, setList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [supply, setSupply] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { connection } = useConnection();
  const { address: authAddress } = useAuth();
  const router = useRouter();

  const loadMore = useCallback(
    async (page?: any) => {
      if (!address) return;
      const _page = typeof page === "number" ? page : pageIndex;

      if (_page === 1) setIsLoading(true);
      try {
        let res = null;
        if (process.env.NEXT_PUBLIC_NET === "Devnet") {
          const tokenAccounts = await connection.getTokenLargestAccounts(
            new PublicKey(address),
            "confirmed"
          );
          console.log("tokenAccounts", tokenAccounts);

          const result: any = {
            items: []
          };

          const accounts = await connection.getMultipleParsedAccounts(
            tokenAccounts.value.map((item: any) => item.address)
          );
          console.log("accounts", accounts);

          for (let i = 0; i < tokenAccounts.value.length; i++) {
            const item = tokenAccounts.value[i];

            result.items.push({
              // @ts-ignore
              owner: accounts.value[i].data?.parsed?.info?.owner?.toString(),
              amount: item.uiAmount?.toString(),
              decimals: item.decimals,
              rank: i + 1
            });
          }

          res = result;
        } else {
          res = await getHoldersByToken(address, _page, pageSize);
        }

        if (res?.items && res.items.length) {
          const addressList = res.items
            .map((item: any) => item.owner)
            .join(",");
          const addressObj = await getUserInfoByAddressList(addressList);

          res.items.forEach((item: any) => {
            if (addressObj[item.owner]) {
              Object.assign(item, {
                flipUser: addressObj[item.owner]
              });
            }
          });
        }

        const newList =
          _page === 1 ? res.items || [] : [...list, ...(res.items || [])];
        setList(newList);

        if (res.items) {
          if (res.items.length < pageSize) {
            setHasMore(false);
          } else {
            setPageIndex(_page + 1);
            setHasMore(true);
          }
        }
      } catch (err) {
        console.log("err:", err);
        if (_page === 1) setList([]);
      } finally {
        setIsLoading(false);
      }
    },
    [address, list, pageIndex]
  );

  const getTokenInfo = useCallback(async () => {
    if (address) {
      if (process.env.NEXT_PUBLIC_NET === "Devnet") {
        const tokenSupply = await connection.getTokenSupply(
          new PublicKey(address),
          "confirmed"
        );
        setSupply(tokenSupply.value.uiAmount || 0);
      } else {
        const tokenInfo = await getTokenMeta(address);
        setSupply(tokenInfo.data.supply);
      }
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

  const { run: loadData } = useDebounceFn(
    (args: any = {}) => {
      if (!address) {
        setList([]);
      } else {
        setPageIndex(1);
        getTokenInfo();
        loadMore(1);
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    loadData();
  }, [address]);

  return (
    <div
      style={style}
      className={`${styles.distributionArea} ${
        from === "panel" ? styles.LaptopList : ""
      }`}
    >
      {from !== "panel" && (
        <div className={styles.distributionTitle}>Holder Distribution</div>
      )}
      <div
        className={`${styles.list}`}
        style={{ paddingTop: from === "panel" ? 0 : 10 }}
      >
        {list.map((item) => {
          if (item.amount === "0") {
            return null;
          }
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
                      <span>
                        {formatAddress(item.owner)}
                        {item.owner === authAddress ? "(Self)" : ""}
                      </span>
                      {item.flipUser && <Level level={item.flipUser?.level} />}
                    </div>
                    <div className={styles.followers}>
                      {item.flipUser?.followers || 0} followers
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.itemContent} button`}
                  onClick={() => {
                    if (item.flipUser) {
                      router.push(`/profile/user?account=${item.owner}`);
                    }

                    fail("Not flipN user yet");
                  }}
                >
                  <div style={{ minWidth: 20 }}>{item.rank}.</div>
                  <div className={styles.UserName}>
                    <span>
                      {formatAddress(item.owner)}
                      {item.owner === authAddress ? "(Self)" : ""}
                    </span>
                    {item.flipUser && <Level level={item.flipUser?.level} />}
                  </div>
                </div>
              )}

              <div className={styles.itemPercent}>
                {new Big(item.amount).div(supply).mul(100).toNumber() > 99.99 &&
                new Big(item.amount).div(supply).mul(100).toNumber() !== 100
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
            marginTop: from === "panel" ? 0 : 30
          }}
        >
          <Empty height={from === "panel" ? 300 : "auto"} text="No holders" />
        </div>
      )}
      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

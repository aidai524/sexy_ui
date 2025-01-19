import { useEffect, useState } from "react";
import CA from "../ca";
import styles from "./txs.module.css";
import { formatAddressLast, httpGet, simplifyNum } from "@/app/utils";
import Big from "big.js";
import Empty from "@/app/components/empty";
import { defaultAvatar } from "@/app/utils/config";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { Switch } from "antd-mobile";
import { useAccount } from "@/app/hooks/useAccount";

const addressReg = /(\w{2}).+(\w{2})/;

export function formatAddress(address: string) {
  if (!address) {
    return "";
  }

  if (address.length > 12) {
    return address.replace(addressReg, ($1, $2, $3) => {
      return $2 + "...." + $3;
    });
  }
}

const switchStyle = {
  "--checked-color": "#90CD15",
  "--width": "37px",
  "--height": "16px",
  "--adm-color-background": "#515B63",
  "--adm-color-border": "#515B63"
  // '--adm-color-text-light-solid': '#808E9A',
};

function SexSwitch({ checked, onChange }: any) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      style={{
        ...switchStyle,
        // @ts-ignore
        "--adm-color-text-light-solid": checked ? "#fff" : "#808E9A"
      }}
    />
  );
}

export default function Txs({ from, data }: any) {
  const [list, setList] = useState([]);
  const router = useRouter();
  const { address } = useAccount();
  const { userInfo } = useAuth();
  const [totalGreater, setTotalGreater] = useState(0);
  const [totalMyFollowing, setTotalMyFollowing] = useState(0);
  const [totalMyTrades, setTotalMyTrades] = useState(0);
  const [filter, setFilter] = useState<any>({
    1: false,
    2: false,
    3: false
  });

  useEffect(() => {
    if (data && data.tokenName && data.status === 1 && data.DApp === "sexy") {
      httpGet(
        `/project/trade/list?limit=100&token_name=${data.address}&greater=${filter[1]}&my_following=${filter[2]}&my_trades=${filter[3]}`
      ).then((res) => {
        if (res.code === 0) {
          setList(res.data.list || []);
          setTotalGreater(res.data.total_greater || 0);
          setTotalMyFollowing(res.data.total_my_following || 0);
          setTotalMyTrades(res.data.total_my_trades || 0);
        }
      });
    }
  }, [data, filter]);

  return (
    <div
      className={styles.main}
      style={{
        backgroundColor: from === "panel" ? "transparent" : "#252328",
        borderRadius: from === "panel" ? "10px" : "15px 15px 0 0"
      }}
    >
      <div className={styles.filter}>
        <div
          className={styles.filterItem}
          style={{
            justifyContent: from === "panel" ? "flex-start" : "space-between"
          }}
        >
          <div
            className={styles.filterText}
            style={{
              fontSize: from === "panel" ? 10 : 12
            }}
          >
            Filter by size
            <img style={{ width: "26px" }} src="/img/home/solana.png" /> 0.05 (
            {totalGreater} trade{totalGreater > 1 ? "s" : ""})
          </div>
          <SexSwitch
            checked={filter[1]}
            onChange={() => {
              setFilter({
                ...filter,
                1: !filter[1]
              });
            }}
          />
        </div>

        {address && (
          <div
            style={{
              display: "flex",
              flexDirection: from === "panel" ? "row" : "column",
              justifyContent: from === "panel" ? "space-between" : "flex-start"
            }}
          >
            <div className={styles.filterItem}>
              <div
                className={styles.filterText}
                style={{
                  fontSize: from === "panel" ? 10 : 12
                }}
              >
                Filter by my following ({totalMyFollowing} trade
                {totalMyFollowing > 1 ? "s" : ""})
              </div>
              <SexSwitch
                checked={filter[2]}
                onChange={() => {
                  setFilter({
                    ...filter,
                    2: !filter[2],
                    3: false
                  });
                }}
              />
            </div>

            <div className={styles.filterItem}>
              <div
                className={styles.filterText}
                style={{
                  fontSize: from === "panel" ? 10 : 12
                }}
              >
                Filter by own trades ({totalMyTrades} trade
                {totalMyTrades > 1 ? "s" : ""})
              </div>
              <SexSwitch
                checked={filter[3]}
                onChange={() => {
                  setFilter({
                    ...filter,
                    3: !filter[3],
                    2: false
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>

      {data && (
        <div
          className={`${styles.txContent} ${
            from === "panel" ? styles.LaptopContent : ""
          }`}
        >
          {data?.status === 1 && (
            <>
              <div
                className={`${styles.txTtitles} ${
                  from === "panel" ? styles.LaptopTitles : styles.MobileTitles
                }`}
              >
                <div style={{ flex: 2 }} className={styles.titleItem}>
                  Account
                </div>
                <div className={styles.titleItem}>Type</div>
                <div className={styles.titleItem}>SOL</div>
                <div className={styles.titleItem}>{data.tokenName}</div>
                <div
                  style={{ textAlign: "right" }}
                  className={styles.titleItem}
                >
                  Txn
                </div>
              </div>

              <div className={styles.txList}>
                {list.map((item: any) => {
                  const isSelf = item.address === userInfo?.address;
                  return (
                    <div
                      key={item.tx_hash}
                      className={`${styles.item}`}
                    >
                      <div
                        className={`${styles.account} ${
                          from === "panel"
                            ? styles.LaptopAccount
                            : styles.MobileAccount
                        } ${!isSelf && "button"}`}

                        onClick={() => {
                          if (!isSelf)
                            router.push(`/profile/user?account=${item.address}&from=detail`);
                        }}
                      >
                        <img
                          className={styles.avatar}
                          src={item.icon || defaultAvatar}
                        />
                        <span>
                          {formatAddress(item.address)}
                          {isSelf && "(Self)"}
                        </span>
                      </div>

                      <div className={styles.type + " " + styles[item.type]}>
                        {item.type}
                      </div>

                      <div className={styles.value}>
                        {item.sol_amount &&
                          simplifyNum(
                            new Big(item.sol_amount).div(10 ** 9).toNumber()
                          )}
                      </div>

                      <div className={styles.vva}>
                        {item.token_amount &&
                          simplifyNum(
                            new Big(item.token_amount).div(10 ** 6).toNumber()
                          )}
                      </div>

                      <div
                        className={`${styles.link} button`}
                        style={{ textAlign: "right" }}
                        onClick={() => {
                          window.open(
                            `https://solscan.io/tx/${item.tx_hash}?cluster=devnet`
                          );
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 1H2C1.44772 1 1 1.44772 1 2V12C1 12.5523 1.44772 13 2 13H7H12C12.5523 13 13 12.5523 13 12V8"
                            stroke="#9290B1"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M9 1H13V5"
                            stroke="#9290B1"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M12.9999 1L5.19995 8.8"
                            stroke="#9290B1"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}

                {(!list || list.length === 0) && (
                  <Empty height={from === "panel" ? 220 : 300} text="No Data" />
                )}
              </div>
            </>
          )}

          {data?.status === 3 && (
            <iframe
              style={{
                height: from === "panel" ? 296 : "calc(100vh - 210px)"
              }}
              id="dexscreener-embed"
              title="Dexscreener Trading Chart"
              width="100%"
              height="800"
              frameBorder="none"
              src={`https://dexscreener.com/near/refv1-4276?embed=1&theme=${"dark"}&info=0&trades=1&chart=0`}
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}

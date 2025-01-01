import { useEffect, useState } from "react";
import CA from "../ca";
import styles from "./txs.module.css";
import { formatAddressLast, httpGet } from "@/app/utils";
import Big from "big.js";
import Empty from "@/app/components/empty";
import { defaultAvatar } from "@/app/utils/config";

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

export default function Txs({ from, data, mc }: any) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (data && data.tokenName) {
      httpGet("/project/trade/list?limit=100&token_name=" + data.address).then(
        (res) => {
          if (res.code === 0) {
            setList(res.data.list || []);
          }
        }
      );
    }
  }, [data]);

  return (
    <div className={styles.main}>
      <CA from={from} data={data} mc={mc} />

      {data && (
        <div
          className={`${styles.txContent} ${
            from === "laptop-home" ? styles.LaptopContent : ""
          }`}
        >
          {data?.status === 1 && (
            <>
              <div className={styles.txTtitles}>
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
                  return (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.account}>
                        <img
                          className={styles.avatar}
                          src={item.icon || defaultAvatar}
                        />
                        <span>{formatAddress(item.address)}</span>
                      </div>

                      <div className={styles.type + " " + styles.sell}>
                        {item.type}
                      </div>

                      <div className={styles.value}>
                        {item.sol_amount &&
                          new Big(item.sol_amount).div(10 ** 9).toFixed(2)}
                      </div>

                      <div className={styles.vva}>
                        {item.token_amount &&
                          new Big(item.token_amount).div(10 ** 6).toFixed(2)}
                      </div>

                      <div
                        className={styles.link}
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
                  <Empty height={300} text="No Data" />
                )}
              </div>
            </>
          )}

          {data?.status === 3 && (
            <iframe
              style={{
                height:
                  from === "laptop"
                    ? "calc(100vh - 430px)"
                    : "calc(100vh - 210px)"
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

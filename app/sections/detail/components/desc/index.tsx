import { Project } from "@/app/type";
import styles from "./detail.module.css";
import TokenTags from "@/app/components/tokenTags";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatAddress, formatDateEn, simplifyNum, timeAgo } from "@/app/utils";
import Holder from "@/app/components/holder";
import { ProgressBar } from "antd-mobile";
import { useTrendsStore } from "@/app/store/useTrends";
import { defaultAvatar } from "@/app/utils/config";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

export default function Desc({
  data,
  specialTime,
  showHolders = true,
  from,
  holdersId
}: {
  data: Project;
  specialTime?: string;
  showHolders?: boolean;
  isCreated?: boolean;
  from?: string;
  holdersId?: string;
}) {
  const { address } = useAccount();
  const { connection } = useConnection();
  const [holders, setHolders] = useState(0);
  const router = useRouter();
  const userName = useMemo(() => {
    if (data?.creater) {
      if (data.creater.name) {
        return data.creater.name;
      }

      if (data.creater.address) {
        return formatAddress(data.creater.address);
      }
    }

    if (data?.account) {
      return formatAddress(data.account);
    }
    return "-";
  }, [data]);

  const { top1 } = useTrendsStore();

  useEffect(() => {
    (async () => {
      if (connection && data) {
        const tokenAccounts = await connection.getTokenLargestAccounts(
          new PublicKey(data.address as string),
          "confirmed"
        );

        // console.log('tokenAccounts', tokenAccounts);
        setHolders(tokenAccounts.value.length);
      }
    })();
  }, [connection, data]);

  return (
    <div className={styles.detailAvatar}>
      {data.status !== 0 && (
        <div
          className={styles.statsPanel}
          style={{
            gridTemplateColumns:
              from === "panel" ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
            marginBottom: from === "panel" ? 0 : 20
          }}
        >
          <div className={styles.statsItem}>
            <div
              className={styles.statsLabel}
              style={{
                fontSize: from === "panel" ? 14 : 10
              }}
            >
              Market Cap
            </div>
            <div className={styles.statsValue}>
              {"$"}
              {data.marketCap24hUsd
                ? simplifyNum(Number(data.marketCap24hUsd))
                : "-"}
            </div>
          </div>
          <div className={styles.statsItem}>
            <div
              className={styles.statsLabel}
              style={{
                fontSize: from === "panel" ? 14 : 10
              }}
            >
              24h Volume
            </div>
            <div className={styles.statsValue}>
              ${simplifyNum(Number(data.volume24hUsd), 2)}
            </div>
          </div>
          <div className={styles.statsItem}>
            <div
              className={styles.statsLabel}
              style={{
                fontSize: from === "panel" ? 14 : 10
              }}
            >
              Holders
            </div>
            <div className={styles.statsValue}>{holders}</div>
          </div>
          <div className={styles.statsItem}>
            <div
              className={styles.statsLabel}
              style={{
                fontSize: from === "panel" ? 14 : 10
              }}
            >
              Txns
            </div>
            <div className={styles.statsValue}>{data.tx}</div>
          </div>
          <div className={styles.statsItem + " " + styles.statsItemBuy}>
            <div
              className={styles.statsLabel}
              style={{
                fontSize: from === "panel" ? 14 : 10
              }}
            >
              <div>
                <div>Buys</div>
                <div className={styles.tradeAmount}>
                  ${simplifyNum(Number(data.buys24hUsd), 2)}
                </div>
              </div>
              <div>
                <div>Sells</div>
                <div className={styles.tradeAmount}>
                  ${simplifyNum(Number(data.sells24hUsd), 2)}
                </div>
              </div>
            </div>
            {Number(data.volume24hUsd) > 0 && (
              <div className={styles.statsValue}>
                <div className={styles.tradeChart}>
                  <div
                    className={styles.buyChart}
                    style={{
                      width:
                        (Number(data.buys24hUsd) / Number(data.volume24hUsd)) *
                          100 +
                        "%"
                    }}
                  ></div>
                  <div
                    className={styles.sellChart}
                    style={{
                      width:
                        (Number(data.sells24hUsd) / Number(data.volume24hUsd)) *
                          100 +
                        "%"
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          padding: from === "panel" ? "0px 15px 15px" : 15,
          backgroundColor: from === "panel" ? "transparent" : "#ffffff14",
          fontSize: 12
        }}
      >
        <div>
          <div
            className={styles.nameWrapper}
            style={{
              padding: from === "panel" ? "0px 0px 10px" : "5px 0px"
            }}
          >
            <div className={styles.ticker}>Name:</div>
            <span className={styles.des}>{data.tokenName}</span>
          </div>

          {data.DApp === "sexy" && (
            <div
              className={styles.nameWrapper}
              style={{
                padding: from === "panel" ? "10px 0px" : "5px 0px"
              }}
            >
              <div className={styles.ticker}>Ticker:</div>
              <span className={styles.des}>{data.ticker}</span>
            </div>
          )}

          <div
            className={styles.nameWrapper}
            style={{
              padding: from === "panel" ? "10px 0px" : "5px 0px"
            }}
          >
            <div className={styles.ticker}>Created by:</div>
            <div
              onClick={() => {
                if (address !== data.account)
                  router.push(
                    "/profile/user?account=" + data.account + "&from=detail"
                  );
              }}
              className={[styles.tickerContent, styles.tickerCreate].join(" ")}
            >
              <img
                className={styles.avatar}
                src={data.creater.icon || defaultAvatar}
              />
              {userName}
              {address === data.account && (
                <span style={{ color: "#FBCA04" }}>(Self)</span>
              )}
            </div>
          </div>

          {data.creater && data.creater.education && (
            <div
              className={styles.nameWrapper}
              style={{
                padding: from === "panel" ? "10px 0px" : "5px 0px"
              }}
            >
              <div className={styles.ticker}>Education:</div>
              <div className={[styles.des].join(" ")}>
                {data.creater && data.creater.education}
              </div>
            </div>
          )}

          <div
            className={styles.nameWrapper}
            style={{
              padding: from === "panel" ? "10px 0px" : "5px 0px"
            }}
          >
            <div className={styles.ticker}>Create:</div>
            <div className={styles.des}>
              {specialTime
                ? specialTime
                : formatDateEn(
                    (data.DApp === "pump"
                      ? data.time
                      : data.createdAt) as number,
                    "YYYY-MM-DD HH:mm:ss"
                  )}
            </div>
          </div>
          {data.DApp === "pump" && (
            <div
              className={styles.nameWrapper}
              style={{
                padding: from === "panel" ? "10px 0px" : "5px 0px"
              }}
            >
              <div className={styles.ticker}>{"Import time"}:</div>
              <div className={styles.des}>
                {specialTime
                  ? specialTime
                  : formatDateEn(
                      data.createdAt as number,
                      "YYYY-MM-DD HH:mm:ss"
                    )}
              </div>
            </div>
          )}
        </div>

        {!!data.about && (
          <>
            <div
              className={styles.nameWrapper}
              style={{
                padding: from === "panel" ? "10px 0px" : "5px 0px"
              }}
            >
              <div className={styles.ticker}>Description:</div>
            </div>
            <div className={styles.aboutUs}>
              <div className={styles.abountDetail}>{data.about}</div>
            </div>
          </>
        )}

        {(data.x || data.tg || data.discord || data.website) && (
          <div
            className={styles.panel}
            style={{
              backgroundColor: from === "panel" ? "transparent" : "#121719",
              padding: from === "panel" ? 0 : 15
            }}
          >
            <div
              className={styles.communityIcons}
              style={{
                gap: from === "panel" ? 20 : 60,
                padding: from === "panel" ? "0" : "0 3vw"
              }}
            >
              {data.website && (
                <a className={styles.link} target="_blank" href={data.website}>
                  <img src="/img/community/website.svg" />
                </a>
              )}

              {data.x && (
                <a className={styles.link} target="_blank" href={data.x}>
                  <img src="/img/community/x.svg" />
                </a>
              )}

              {data.tg && (
                <a className={styles.link} target="_blank" href={data.tg}>
                  <img src="/img/community/telegram.svg" />
                </a>
              )}

              {data.discord && (
                <a className={styles.link} target="_blank" href={data.discord}>
                  <img src="/img/community/discard.svg" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {data.status! > 0 &&
        ((from === "panel" && data.kingProgress) || from !== "panel") && (
          <div
            className={styles.singleProgress}
            style={{
              backgroundColor: from === "panel" ? "transparent" : "#ffffff14"
            }}
          >
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>Crowned progress</div>
              <div className={styles.progressPercent}>
                {data.kingProgress && top1?.address === data.address
                  ? 100
                  : data.kingProgress}
                %
              </div>
            </div>
            <ProgressBar
              percent={
                data.kingProgress && top1?.address === data.address
                  ? 100
                  : data.kingProgress
              }
              style={{
                "--track-width": "4px",
                "--fill-color": "#FCD743",
                "--track-color": "#3C3C3C80"
              }}
            />

            {data.lastKingTime !== 0 && (
              <div className={styles.progressDesc} style={{ color: "#FCD743" }}>
                Crowned king of the hill on{" "}
                {data.lastKingTime
                  ? formatDateEn(data.lastKingTime, "MMM D, YYYY HH:mm:ss")
                  : "-"}
              </div>
            )}
          </div>
        )}

      {showHolders && data.status! > 0 && from !== "panel" && (
        <div className={styles.panel} id={holdersId}>
          <Holder address={data.address} />
        </div>
      )}
    </div>
  );
}

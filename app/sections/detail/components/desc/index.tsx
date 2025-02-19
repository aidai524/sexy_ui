import { Project } from "@/app/type";
import styles from "./detail.module.css";
import TokenTags from "@/app/components/tokenTags";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { formatAddress, formatDateEn, simplifyNum, timeAgo } from "@/app/utils";
import useMc from "@/app/hooks/useMc";
import Holder from "@/app/components/holder";
import { ProgressBar } from "antd-mobile";
import { useTrendsStore } from "@/app/store/useTrends";

export default function Desc({ data, specialTime, mc, showHolders = true }: { data: Project, specialTime?: string, mc: any, showHolders?: boolean }) {
    const { address } = useAccount();
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

    const { mc: pumpMc } = useMc({
        tokenAddress: data?.address,
        disable: (data?.DApp === "sexy" && data?.status === 1) || data?.status! < 1
    });

    const { top1 } = useTrendsStore();

    return <div className={styles.detailAvatar}>
        <div className={styles.infoArea}>
            <div>
                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Name:</div>
                    <span className={styles.des}>{data.tokenName}</span>
                </div>

                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Ticker:</div>
                    <span className={styles.des}>{data.ticker}</span>
                </div>

                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Created by:</div>
                    <div
                        onClick={() => {
                            if (address !== data.account)
                                router.push(
                                    "/profile/user?account=" + data.account + "&from=detail"
                                );
                        }}
                        className={[
                            styles.tickerContent,
                        ].join(" ")}
                    >
                        {userName}
                        {address === data.account && (
                            <span style={{ color: "#FBCA04" }}>(Self)</span>
                        )}
                    </div>
                </div>

                {data.creater && data.creater.education && (
                    <div className={styles.nameWrapper}>
                        <div className={styles.ticker}>Education:</div>
                        <div
                            className={[styles.des].join(" ")}
                        >
                            {data.creater && data.creater.education}
                        </div>
                    </div>
                )}
                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Create time:</div>
                    <div className={styles.des}>
                        {specialTime
                            ? specialTime
                            : timeAgo(data.DApp === "pump" ? data.time : data.createdAt)}
                    </div>
                </div>
                {data.DApp === "pump" && (
                    <div className={styles.nameWrapper}>
                        <div className={styles.ticker}>{"Import time"}:</div>
                        <div className={styles.des}>
                            {specialTime ? specialTime : timeAgo(data.createdAt)}
                        </div>
                    </div>
                )}
                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Market cap:</div>
                    {data.DApp === "sexy" && data.status === 1 && (
                        <div className={styles.authorDesc} key={data.address}>
                            {mc === 0 || mc === "0" || mc === "-" ? (
                                <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                            ) : (
                                <div style={{ color: "#6fff00" }}>
                                    ${simplifyNum(mc as number, 2)}
                                </div>
                            )}
                        </div>
                    )}

                    {((data.status === 1 && data.DApp === "pump") ||
                        data.status! > 1) && (
                            <div
                                className={styles.authorDesc}
                                key={data.address}
                                style={{ color: "#6fff00" }}
                            >
                                {pumpMc === 0 ? (
                                    <div style={{ color: "rgba(255, 255, 255, 0.5)" }}>$-</div>
                                ) : (
                                    <div style={{ color: "#6fff00" }}>
                                        ${simplifyNum(pumpMc as number, 2)}
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </div>

            {!!data.about && (<>
                <div className={styles.nameWrapper}>
                    <div className={styles.ticker}>Description:</div>
                </div>
                <div className={styles.aboutUs}>
                    <div className={styles.abountDetail}>{data.about}</div>
                </div>
            </>
            )}

            {(data.x || data.tg || data.discord || data.website) && (
                <div className={styles.panel}>
                    <div
                        className={styles.communityIcons}
                        style={{
                            gap: "60px"
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

        <div className={styles.singleProgress}>
            <div className={styles.progressTitleWrapper}>
              <div className={styles.progressTitle}>
                Crowned progress
              </div>
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

        {showHolders && data.status! > 0 && (
            <div className={styles.panel}>
                <Holder address={data.address} />
            </div>
        )}

    </div>;
}   
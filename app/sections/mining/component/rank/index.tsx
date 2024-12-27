import styles from "./index.module.css";
import Avatar from "./avatar";
import Icon from "@/app/components/points-label/Reicon";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";

export default function Rank({ list, rank }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.Title}>Mining Rank</div>
        <div className={styles.YourRank}>
          <span>Your Rank:</span>
          <div className={styles.YourRankTag}>{rank || "-"}</div>
        </div>
      </div>
      <div
        className={styles.List}
        style={{
          height: isMobile ? "auto" : "calc(100vh - 510px)"
        }}
      >
        {list.map((item: any, index: number) => (
          <div className={styles.Item} key={index}>
            <div className={styles.ItemLeft}>
              <Avatar rank={index + 1} src={item.account_data?.icon} />
              <div>
                <div className={styles.ItemTitle}>
                  {item.account_data?.name}
                </div>
                {isMobile && (
                  <div className={styles.ItemDesc}>
                    {item.account_data?.followers} followers
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className={styles.ItemTitle} style={{ marginLeft: 60 }}>
                  {item.account_data?.followers}{" "}
                  <span style={{ color: "#FFFFFFB5" }}>followers</span>
                </div>
              )}
            </div>
            <div className={styles.ItemRight}>
              <span>
                {numberFormatter(item.minted_amount, 2, true, {
                  isShort: true
                })}
              </span>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

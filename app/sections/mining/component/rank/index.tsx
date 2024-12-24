import styles from "./index.module.css";
import Avatar from "./avatar";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";

export default function Rank({ list }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div className={styles.Container}>
      <div className={styles.Header}>
        <div className={styles.Title}>Mining Rank</div>
        <div className={styles.YourRank}>
          <span>Your Rank:</span>
          <div className={styles.YourRankTag}>123</div>
        </div>
      </div>
      <div className={styles.List}>
        {list.map((item: any, index: number) => (
          <div className={styles.Item} key={index}>
            <div className={styles.ItemLeft}>
              <Avatar rank={index + 1} />
              <div>
                <div className={styles.ItemTitle}>Party Girl</div>
                {isMobile && (
                  <div className={styles.ItemDesc}>245 followers</div>
                )}
              </div>
              {!isMobile && (
                <div className={styles.ItemTitle} style={{ marginLeft: 60 }}>
                  245 <span style={{ color: "#FFFFFFB5" }}>followers</span>
                </div>
              )}
            </div>
            <div className={styles.ItemRight}>
              {numberFormatter(item.minted_amount, 2, true, {
                isShort: true
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import styles from "./index.module.css";
import Avatar from "./avatar";
import Icon from "@/app/components/points-label/Reicon";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";

export default function Rank({ list, rank }: any) {
  const { isMobile } = useUserAgent();
  const { userInfo } = useAuth();
  const router = useRouter();
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
                <button
                  className={`${styles.ItemTitle} ${
                    item.address !== userInfo?.address && "button"
                  }`}
                  style={{
                    cursor: item.account_data ? "pointer" : "inherit"
                  }}
                  onClick={() => {
                    if (!item.account_data) return;
                    if (item.address !== userInfo?.address)
                      router.push(`/profile/user?account=${item.address}`);
                  }}
                >
                  {item.account_data?.name
                    ? item.account_data.name
                    : item.address
                    ? formatAddress(item.address)
                    : ""}
                </button>
                {isMobile && (
                  <div className={styles.ItemDesc}>
                    {item.account_data?.followers || 0} followers
                  </div>
                )}
              </div>
              {!isMobile && (
                <div className={styles.ItemTitle} style={{ marginLeft: 60 }}>
                  {item.account_data?.followers || 0}{" "}
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

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
    <div
      className={styles.Container}
      style={{
        padding: isMobile ? "20px 12px" : "10px 0px 0px 0px"
      }}
    >
      <div
        className={styles.Header}
        style={{
          padding: isMobile ? 0 : "20px 60px 15px",
          borderBottom: isMobile ? "none" : "1px solid #FFFFFF33"
        }}
      >
        <div className={styles.Title}>Mining Rank</div>
        <div className={styles.YourRank}>
          <span
            style={{
              fontSize: isMobile ? 10 : 12
            }}
          >
            Your Rank:
          </span>
          <div
            className={styles.YourRankTag}
            style={{
              fontSize: isMobile ? 10 : 14
            }}
          >
            {rank || "-"}
          </div>
        </div>
      </div>
      <div
        className={styles.List}
        style={{
          height: isMobile ? "auto" : "calc(100vh - 510px)",
          padding: isMobile ? 0 : "0px 30px"
        }}
      >
        {list.map((item: any, index: number) => (
          <div
            className={`${styles.Item} ${
              isMobile ? styles.MobileItem : styles.LaptopItem
            }`}
            key={index}
          >
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

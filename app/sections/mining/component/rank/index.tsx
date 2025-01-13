import styles from "./index.module.css";
import Avatar from "./avatar";
import Icon from "@/app/components/points-label/Reicon";
import Level from "@/app/components/level/simple";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";
import CircleLoading from "@/app/components/icons/loading";
import Header from "./header";

export default function Rank({ rank, list = [], loading }: any) {
  const { isMobile } = useUserAgent();

  return (
    <div
      className={styles.Container}
      style={{
        padding: isMobile ? "20px 12px" : "10px 0px 0px 0px"
      }}
    >
      <Header isMobile={isMobile} rank={rank} />
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
              <div style={{ width: isMobile ? "auto" : 120 }}>
                <div className={styles.NameWrapper}>
                  <button
                    className={`${styles.ItemTitle}`}
                    style={{
                      cursor: item.account_data ? "pointer" : "inherit"
                    }}
                  >
                    {item.account_data?.name
                      ? item.account_data.name
                      : item.address
                      ? formatAddress(item.address, 4)
                      : ""}
                  </button>
                  {item.account_data?.level && (
                    <Level level={item.account_data.level} />
                  )}
                </div>

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
                {numberFormatter(item.minted_amount, 3, true, {
                  isShort: true,
                  round: 0
                })}
              </span>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div
          style={{
            paddingTop: 60,
            textAlign: "center"
          }}
        >
          <CircleLoading size={30} />
        </div>
      )}
    </div>
  );
}

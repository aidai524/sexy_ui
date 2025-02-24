import styles from "./index.module.css";
import Avatar from "./avatar";
import Icon from "@/app/components/points-label/Reicon";
import Level from "@/app/components/level/simple";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";
import CircleLoading from "@/app/components/icons/loading";
import Header from "./header";
import clsx from 'clsx';

export default function Rank(props: any) {
  const {
    rank,
    list = [],
    loading,
    isHeader = true,
    className,
    listClassName,
    itemClassName,
    itemLeftClassName,
    itemRightClassName,
  } = props;
  const { isMobile } = useUserAgent();

  return (
    <div
      className={clsx(styles.Container, className)}
      style={{
        padding: isMobile ? "20px 12px" : "0px"
      }}
    >
      {
        isHeader && (
          <Header isMobile={isMobile} rank={rank} />
        )
      }
      <div
        className={clsx(styles.List, listClassName)}
        style={{
          height: isMobile ? "auto" : "calc(100% - 50px)"
        }}
      >
        {list.map((item: any, index: number) => (
          <div
            className={clsx(styles.Item, isMobile ? styles.MobileItem : styles.LaptopItem, itemClassName)}
            key={index}
          >
            <div className={clsx(styles.ItemLeft, itemLeftClassName)}>
              <Avatar rank={index + 1} src={item.account_data?.icon} />
              <div style={{ width: 120 }}>
                <div className={styles.NameWrapper}>
                  <button className={`${styles.ItemTitle}`}>
                    {item.account_data?.name
                      ? item.account_data.name
                      : item.address
                      ? formatAddress(item.address, 4)
                      : ""}
                  </button>
                  <Level level={item.account_data?.level} />
                </div>

                <div className={styles.ItemDesc}>
                  {item.account_data?.followers || 0} followers
                </div>
              </div>
            </div>
            <div className={clsx(styles.ItemRight, itemRightClassName)}>
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

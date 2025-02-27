import clsx from "clsx";
import styles from "./item.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import Avatar from "./avatar";
import Icon from "@/app/components/points-label/Reicon";
import Level from "@/app/components/level/simple";
import { numberFormatter } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";

export default function RankItem({
  item,
  rank,
  className,
  itemRightClassName,
  itemLeftClassName,
  itemClassName,
  isUser
}: any) {
  const { isMobile } = useUserAgent();
  return (
    <div
      className={clsx(
        styles.Item,
        isMobile ? styles.MobileItem : styles.LaptopItem,
        itemClassName,
        className
      )}
    >
      <div className={clsx(styles.ItemLeft, itemLeftClassName)}>
        <Avatar rank={rank} src={item.account_data?.icon} isUser={isUser} />
        <div style={{ width: 120 }}>
          <div className={styles.NameWrapper}>
            <button className={`${styles.ItemTitle}`}>
              {item.account_data?.name
                ? item.account_data.name
                : item.address
                ? formatAddress(item.address, 4)
                : ""}
            </button>
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
  );
}

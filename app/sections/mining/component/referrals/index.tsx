import styles from "../rank/index.module.css";
import itemsStyles from "../rank/item.module.css";
import SimpleAvatar from "@/app/components/avatar/simple";
import Icon from "@/app/components/points-label/Reicon";
import { useUserAgent } from "@/app/context/user-agent";
import { numberFormatter } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";
import CircleLoading from "@/app/components/icons/loading";
import Header from "../rank/header";
import clsx from "clsx";
import useReferrals from "../../use-referrals";
import { useMemo } from "react";
import Modal from "@/app/components/modal";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";

export default function Referrals({ show, onClose }: any) {
  const { list, loading, hasMore, total, page, onNextPage } = useReferrals();
  const { isMobile } = useUserAgent();
  const isFirstPage = useMemo(() => page.current === 1, [page.current]);
  return (
    <Modal
      open={show}
      onClose={onClose}
      animation={isMobile ? "popup" : "modal"}
      forceNoCloseIcon={isMobile}
    >
      <div
        className={styles.Container}
        style={{
          borderRadius: isMobile ? "20px 20px 0px 0px" : 20,
          width: "100vw",
          maxWidth: 486,
          backgroundColor: "#252328",
          padding: "20px 0px 20px"
        }}
      >
        <div style={{ paddingLeft: 20 }}>
          <Header isMobile={isMobile} text={`Referrals (${total})`} />
        </div>
        <div
          className={styles.List}
          style={{
            height: isMobile ? "auto" : "calc(100% - 50px)"
          }}
        >
          {list.map((item: any, index: number) => (
            <div
              className={clsx(
                itemsStyles.Item,
                isMobile ? itemsStyles.MobileItem : itemsStyles.LaptopItem
              )}
              key={index}
            >
              <div className={clsx(itemsStyles.ItemLeft)}>
                <SimpleAvatar src={item.account_data?.icon} />
                <div style={{ width: 120 }}>
                  <div className={itemsStyles.NameWrapper}>
                    <button className={`${itemsStyles.ItemTitle}`}>
                      {formatAddress(item.account_id, 4)}
                    </button>
                  </div>
                </div>
              </div>
              <div className={clsx(itemsStyles.ItemRight)}>
                <span>
                  +
                  {numberFormatter(item.total, 3, true, {
                    isShort: true,
                    round: 0
                  })}
                </span>
                <Icon size={20} />
              </div>
            </div>
          ))}

          {list.length > 0 && (
            <SexInfiniteScroll loadMore={onNextPage} hasMore={hasMore} />
          )}
        </div>
        {isFirstPage && loading && (
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
    </Modal>
  );
}

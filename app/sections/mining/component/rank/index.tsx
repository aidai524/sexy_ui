import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import CircleLoading from "@/app/components/icons/loading";
import Header from "./header";
import RankItem from "./item";
import clsx from "clsx";

export default function Rank(props: any) {
  const {
    info,
    userInfo,
    loading,
    className,
    listClassName,
    itemClassName,
    itemLeftClassName,
    itemRightClassName
  } = props;
  const { isMobile } = useUserAgent();

  return (
    <div className={clsx(styles.Container, className)}>
      <Header />
      <div
        className={clsx(styles.List, listClassName)}
        style={{
          height: isMobile ? "auto" : "calc(100% - 50px)"
        }}
      >
        {info?.mining_rank?.map((item: any, index: number) => (
          <RankItem
            key={index}
            rank={index + 1}
            {...{
              item,
              itemRightClassName,
              itemLeftClassName,
              itemClassName
            }}
          />
        ))}
        <RankItem
          item={{
            account_data: { name: userInfo?.name, level: userInfo?.level },
            address: userInfo?.address,
            minted_amount: info?.minted
          }}
          rank={info?.your_rank}
          className={styles.UserRank}
          isUser={true}
        />
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

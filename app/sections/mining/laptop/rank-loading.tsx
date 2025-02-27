import { Skeleton } from "antd-mobile";
import Rank from "@/app/sections/mining/component/rank/rank-icon";
import styles from "../component/rank/item.module.css";

export default function RankLoading() {
  return [...new Array(10)].map((_, index: number) => (
    <div key={index} className={styles.Item}>
      <div className={styles.ItemLeft}>
        <Rank rank={index + 1} />
        <Skeleton
          animated
          style={{ width: 30, height: 30, borderRadius: 60 }}
        />
        <Skeleton animated style={{ width: 90, height: 17, borderRadius: 4 }} />
      </div>
      <div className={styles.ItemRight}>
        <Skeleton animated style={{ width: 60, height: 17, borderRadius: 4 }} />
        <Skeleton
          animated
          style={{ width: 20, height: 20, borderRadius: 20 }}
        />
      </div>
    </div>
  ));
}

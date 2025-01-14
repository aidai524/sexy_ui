import styles from "./index.module.css";
import Bg from "./bg";
import Image from "next/image";
import { numberFormatter, addThousandSeparator } from "@/app/utils/common";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useRouter } from "next/navigation";

export default function TotalPanel({ info }: any) {
  const { set }: any = useHomeTab();
  const router = useRouter();
  return (
    <div className={styles.Container}>
      <div className={styles.FunPanel}>
        <div className={styles.FunPanelContent}>
          <div className={styles.FunPanelItem}>
            <div className={styles.FunLike}>+{info?.once_like_amount || 0}</div>
            <div className={styles.PabelLabel}>$FUN / Like</div>
          </div>
          <div className={styles.FunPanelItem}>
            <div className={styles.MyLike}>
              {info?.minted
                ? numberFormatter(info.minted, 3, true, {
                    isShort: true,
                    round: 0
                  })
                : "-"}
            </div>
            <div className={styles.PabelLabel}>My $FUN</div>
          </div>
        </div>
        <Bg className={styles.FunPanelBg} />
      </div>
      <div className={styles.Statistics}>
        <div className={styles.StatisticsItem}>
          <div className={styles.StatisticsLabel}>My likes</div>
          <div
            className={styles.StatisticsValue}
            style={{
              borderBottom: info?.liked ? "1px dashed #fff" : "none",
              cursor: info?.liked ? "pointer" : ""
            }}
            onClick={() => {
              if (!info?.liked) return;
              set({ profileTabIndex: 3 });
              router.push("/profile");
            }}
          >
            {info?.liked ? addThousandSeparator(info?.liked) : "-"}
          </div>
        </div>
        <div className={styles.StatisticsItem}>
          <div className={styles.StatisticsLabel}>Refferrals</div>
          <div className={styles.StatisticsValue}>
            {info?.my_referrals ? addThousandSeparator(info.my_referrals) : "-"}
          </div>
        </div>
        <div className={styles.StatisticsItem}>
          <div className={styles.StatisticsLabel}>Kickback</div>
          <div className={styles.StatisticsValue}>
            <span>
              {info?.my_kickback
                ? numberFormatter(info.my_kickback, 3, true, {
                    isShort: true,
                    round: 0
                  })
                : "-"}
            </span>
            <Image
              src="/img/home/solana.png"
              width={20}
              height={20}
              alt="Solana"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

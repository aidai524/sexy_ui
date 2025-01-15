import styles from "./index.module.css";
import Bg from "./bg";
import Image from "next/image";
import { numberFormatter, addThousandSeparator } from "@/app/utils/common";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useRouter } from "next/navigation";
import { useUserAgent } from "@/app/context/user-agent";

export default function TotalPanel({ info }: any) {
  const { set }: any = useHomeTab();
  const router = useRouter();
  const { isMobile } = useUserAgent();
  return (
    <div
      className={styles.Container}
      style={{
        backgroundColor: isMobile ? "rgba(255, 255, 255, 0.08)" : "transparent",
        margin: isMobile ? 10 : 0,
        padding: isMobile ? 10 : 0
      }}
    >
      <div
        className={styles.FunPanel}
        style={{
          width: isMobile ? 343 : "100%",
          height: isMobile ? 80 : 116
        }}
      >
        <div
          className={styles.FunPanelContent}
          style={{
            justifyContent: isMobile ? "flex-start" : "space-around"
          }}
        >
          <div
            style={{
              width: isMobile ? "48%" : "auto",
              textAlign: isMobile ? "left" : "center"
            }}
          >
            <div className={styles.FunLike}>
              +
              <span
                style={{
                  fontSize: isMobile ? 26 : 42
                }}
              >
                {info?.once_like_amount || 0}
              </span>
            </div>
            <div
              className={styles.PabelLabel}
              style={{
                fontSize: isMobile ? 12 : 16
              }}
            >
              $FUN / Like
            </div>
          </div>
          <div
            style={{
              width: isMobile ? "48%" : "auto",
              textAlign: isMobile ? "left" : "center"
            }}
          >
            <div className={styles.MyLike}>
              {info?.minted
                ? numberFormatter(info.minted, 3, true, {
                    isShort: true,
                    round: 0
                  })
                : "-"}
            </div>
            <div
              className={styles.PabelLabel}
              style={{
                fontSize: isMobile ? 12 : 16,
                transform: isMobile ? "translateY(0px)" : "translateY(8px)"
              }}
            >
              My $FUN
            </div>
          </div>
        </div>
        <Bg className={styles.FunPanelBg} />
      </div>
      <div
        className={styles.Statistics}
        style={{
          marginTop: isMobile ? 26 : 35
        }}
      >
        <div
          className={isMobile ? styles.StatisticsItem : styles.StatisticsItemPc}
        >
          <div className={styles.StatisticsLabel}>My likes</div>
          <div
            className={styles.StatisticsValue}
            style={{
              borderBottom: info?.liked ? "1px dashed #fff" : "none",
              cursor: info?.liked ? "pointer" : "",
              fontSize: isMobile ? 18 : 22
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
        <div
          className={isMobile ? styles.StatisticsItem : styles.StatisticsItemPc}
        >
          <div className={styles.StatisticsLabel}>Refferrals</div>
          <div
            className={styles.StatisticsValue}
            style={{
              fontSize: isMobile ? 18 : 22
            }}
          >
            {info?.my_referrals ? addThousandSeparator(info.my_referrals) : "-"}
          </div>
        </div>
        <div
          className={isMobile ? styles.StatisticsItem : styles.StatisticsItemPc}
        >
          <div className={styles.StatisticsLabel}>Kickback</div>
          <div
            className={styles.StatisticsValue}
            style={{
              fontSize: isMobile ? 18 : 22
            }}
          >
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

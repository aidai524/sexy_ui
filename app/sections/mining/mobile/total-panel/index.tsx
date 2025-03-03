import styles from "./index.module.css";
import Image from "next/image";
import { numberFormatter, addThousandSeparator } from "@/app/utils/common";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useRouter } from "next/navigation";
import { useUserAgent } from "@/app/context/user-agent";
import Referrals from "../../component/referrals";
import SimpleAvatar from "@/app/components/avatar/simple";
import LimitProject from "../../component/limitProjects";
import { useState } from "react";
import clsx from "clsx";
import { simplifyNum } from "@/app/utils";

export default function TotalPanel({ info, userInfo }: any) {
  const homeTabStore: any = useHomeTab();
  const router = useRouter();
  const { isMobile } = useUserAgent();
  const [showReferrals, setShowReferrals] = useState(false);

  const LikeNum = () => (
    <div
      className={styles.StatisticsValue}
      style={{
        borderBottom: info?.liked ? "1px dashed #fff" : "none",
        cursor: info?.liked ? "pointer" : "",
        fontSize: 18,
        marginTop: 0
      }}
      onClick={() => {
        if (!info?.liked) return;
        homeTabStore.set({
          currentSummary: { label: "All", amount: 0, value: "" },
          profileTabName: "Liked"
        });
        router.push("/profile");
      }}
    >
      {info?.liked ? addThousandSeparator(info?.liked) : "-"}
    </div>
  );

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.Header}>
          <SimpleAvatar icon={userInfo?.icon} size={40} />
          <div className={styles.Name}>{userInfo?.name}</div>
        </div>
        <div className={styles.Panels}>
          <div className={styles.Panel}>
            <div className={styles.FunLike}>
              +
              <span
                style={{
                  fontSize: 26
                }}
              >
                {info?.once_like_amount || 0}
              </span>
            </div>
            <div className={styles.PanelBottom}>
              <div
                className={styles.PabelLabel}
                style={{
                  fontSize: 12
                }}
              >
                <span style={{ color: "#FBCA04" }}>$FUN</span> / Like
              </div>
              {isMobile && <LikeNum />}
            </div>
          </div>
          <div className={styles.Panel}>
            <div
              style={{
                width: "48%"
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
              <div className={styles.PanelBottom}>
                <div
                  className={styles.PabelLabel}
                  style={{
                    fontSize: 12
                  }}
                >
                  My <span style={{ color: "#FBCA04" }}>$FUN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Statistics}>
          {!isMobile && (
            <div
              className={
                isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
              }
            >
              <div className={styles.StatisticsLabel}>My likes</div>
              <div className={clsx(styles.StatisticsValue, "button")}>
                <LikeNum />
              </div>
            </div>
          )}
          <div
            className={
              isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
            }
          >
            <div className={styles.StatisticsLabel}>Referrals</div>
            <div
              className={clsx(styles.StatisticsValue, "button")}
              onClick={() => {
                if (!info?.referral_number) return;
                setShowReferrals(true);
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  borderBottom: info?.referral_number
                    ? "1px dashed #fff"
                    : "none"
                }}
              >
                {info?.referral_number
                  ? addThousandSeparator(info.referral_number)
                  : info?.referral_number === 0
                  ? 0
                  : "-"}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 400
                }}
              >
                +{simplifyNum(info?.referral_point, 2)}k{" "}
                <span style={{ color: "#FBCA04" }}>$FUN</span>
              </span>
            </div>
          </div>
          <div
            className={
              isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
            }
          >
            <div className={styles.StatisticsLabel}>Kickback</div>
            <div
              className={styles.StatisticsValue}
              style={{
                fontSize: 14
              }}
            >
              <span>
                {info?.my_kickback
                  ? numberFormatter(info.my_kickback, 3, true, {
                      isShort: true,
                      round: 0
                    })
                  : info?.my_kickback === 0
                  ? 0
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
          <div
            className={
              isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
            }
          >
            <div className={styles.StatisticsLabel}>My volume</div>
            <div
              className={styles.StatisticsValue}
              style={{
                fontSize: 18
              }}
            >
              {info?.my_volume
                ? numberFormatter(info?.my_volume, 2, true, {
                    isShort: true,
                    round: 0,
                    prefix: "$"
                  })
                : "$-"}
            </div>
          </div>
          <div
            className={
              isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
            }
          >
            <div className={styles.StatisticsLabel}>Launch Rate</div>
            <div
              className={styles.StatisticsValue}
              style={{
                fontSize: 18
              }}
            >
              <span>
                {info?.launching_rate
                  ? (info.launching_rate * 100).toFixed(2)
                  : "-"}
                %
              </span>
            </div>
          </div>
          {!isMobile && (
            <div
              className={
                isMobile ? styles.StatisticsItem : styles.StatisticsItemPc
              }
            >
              <div className={styles.StatisticsLabel}>Launched Projects</div>
              <div className={clsx(styles.StatisticsValue, "button")}>
                <LimitProject list={info?.launched_project} />
              </div>
            </div>
          )}
        </div>
      </div>
      <Referrals
        show={showReferrals}
        onClose={() => {
          setShowReferrals(false);
        }}
      />
    </>
  );
}

import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import InfoIcon from "../info-icon";

export default function LikeToEarn({ info, userInfo }: any) {
  const router = useRouter();
  const remainingNum = useMemo(
    () => userInfo?.like_num - userInfo?.using_like_num,
    [userInfo]
  );
  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #FFA8E8"
      }}
    >
      <div
        className={styles.ItemBg}
        style={{
          background:
            "radial-gradient(74.25% 66.17% at 63.1% 125%, #AB2840 0%, #0C0106 100%)"
        }}
      />
      <div className={styles.ItemContent}>
        <div className={styles.ItemHeader}>
          <div className={styles.ItemTitle}>
            <span>Like to Earn</span>
            {/* <InfoIcon
              onClick={() => {
              }}
            /> */}
          </div>
        </div>
        <div className={styles.ItemDesc}>
          {info?.like_num || 100} likes per day
        </div>
        <div className={styles.ItemBottom}>
          <div>{remainingNum || 100} left today</div>
          <div className={styles.ItemBottomButtons}>
            {userInfo?.address ? (
              <button
                type="button"
                className={styles.Button}
                disabled={remainingNum === 0}
                onClick={() => {
                  router.push("/");
                }}
              >
                View Memes
              </button>
            ) : (
              <WalletModalButton className={styles.Button}>
                Connect
              </WalletModalButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

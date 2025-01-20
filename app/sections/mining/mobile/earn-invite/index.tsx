import styles from "./index.module.css";
import Link from "next/link";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { fail, success } from "@/app/utils/toast";
import { useUserAgent } from "@/app/context/user-agent";
import { useReferStore } from "@/app/store/useRefer";

export default function EarnAndInvite({ info, rate, rateLoading }: any) {
  const { userInfo } = useAuth();
  const { isMobile } = useUserAgent();
  const store = useReferStore();

  return (
    <div
      className={styles.Container}
      style={{
        gap: isMobile ? 14 : 24
      }}
    >
      <div
        className={styles.Item}
        style={{
          border: " 1px solid #ffa8e8",
          width: isMobile ? "calc(50vw - 21px)" : 320,
          height: isMobile ? 142 : 165
        }}
      >
        <div
          className={styles.ItemBg}
          style={{
            background:
              "radial-gradient(74.25% 66.17% at 63.1% 125%, rgba(171, 40, 64, 0.8) 0%, rgba(12, 1, 6, 0.8) 100%)"
          }}
        />
        <div className={styles.ItemContent}>
          <div className={styles.Title}>Like to Earn</div>
          <div className={styles.Desc}>
            {info?.like_num || 100} likes per day
          </div>
          <div
            className={styles.Num}
            style={{
              height: isMobile ? 24 : 27
            }}
          >
            {info?.remaining_like_num || 100} left
          </div>
          <Link className={styles.Button} href="/">
            View Memes
          </Link>
        </div>
      </div>
      <div
        className={styles.Item}
        style={{
          border: " 1px solid #C9FF5D",
          width: isMobile ? "calc(50vw - 21px)" : 320,
          height: isMobile ? 142 : 165
        }}
      >
        <div
          className={styles.ItemBg}
          style={{
            background:
              "radial-gradient(74.25% 66.17% at 63.1% 125%, rgba(87, 113, 35, 0.80) 0%, rgba(12, 1, 6, 0.80) 100%)"
          }}
        />
        <div className={styles.ItemContent}>
          <div className={styles.Title}>Invite Frenz</div>
          <div className={styles.Desc}>Kickback Ratio</div>
          <div
            className={styles.Num}
            style={{
              height: isMobile ? 24 : 27
            }}
          >
            {rate || 100} %
          </div>

          {userInfo?.address ? (
            <button
              type="button"
              className={styles.Button}
              onClick={() => {
                if (!window.sexAddress) {
                  //@ts-ignore
                  window.connect();
                  return;
                }
                store.setVisible(true);
              }}
            >
              Invite
            </button>
          ) : (
            <WalletModalButton className={styles.Button}>
              Connect
            </WalletModalButton>
          )}
        </div>
      </div>
    </div>
  );
}

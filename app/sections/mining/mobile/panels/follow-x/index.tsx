import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import XButton from "./x-button";
import CheckedIcon from "../checked-icon";

export default function FollowX({ info }: any) {
  const { userInfo } = useAuth();
  const router = useRouter();
  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #FBCA04"
      }}
    >
      <div
        className={styles.ItemBg}
        style={{
          background:
            "radial-gradient(74.25% 66.17% at 63.1% 125%, #FBCA04 0%, #0C0106 100%)"
        }}
      />
      <div className={styles.ItemContent}>
        <div className={styles.ItemHeader}>
          <div className={styles.ItemTitle}>
            <span>Follow X</span>
          </div>
          <div className={styles.ItemSubTitle}>
            +10 <span className={styles.ThemeColor}>$FUN</span>
          </div>
        </div>
        <div className={styles.ItemDesc}></div>
        <div className={styles.ItemBottom}>
          {userInfo?.address ? (
            <XButton
              onClick={() => {
                window.open("https://x.com/flipndotfun", "_blank");
              }}
            />
          ) : (
            <div />
          )}
          <div className={styles.ItemBottomButtons}>
            {userInfo?.address ? (
              true ? (
                <button
                  type="button"
                  className={styles.Button}
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Authorize
                </button>
              ) : (
                <div className={styles.Checked}>
                  <CheckedIcon />
                  <span>Authorized</span>
                </div>
              )
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

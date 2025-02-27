import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useReferStore } from "@/app/store/useRefer";
import { useAuth } from "@/app/context/auth";
import InfoIcon from "../info-icon";

export default function InviteFrenz({
  rate,
  onOpenInviteCodes,
  onCopyAll
}: any) {
  const store = useReferStore();
  const { userInfo } = useAuth();
  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #C9FF5D"
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
        <div className={styles.ItemHeader}>
          <div className={styles.ItemTitle}>
            <span>Invite Frenz</span>
            <InfoIcon
              onClick={() => {
                if (!window.sexAddress) {
                  //@ts-ignore
                  window.connect();
                  return;
                }
                store.setVisible(true);
              }}
            />
          </div>
        </div>
        <div className={styles.ItemDesc}>
          You will get {rate || "-"}%{" "}
          <span className={styles.ThemeColor}>$FUN</span>of Airdrops from
        </div>
        <div className={styles.ItemBottom}>
          <div>5 invite code</div>
          <div className={styles.ItemBottomButtons}>
            <div className={styles.LinkButton} onClick={onCopyAll}>
              Copy
            </div>
            {userInfo?.address ? (
              <button
                type="button"
                className={styles.Button}
                onClick={onOpenInviteCodes}
              >
                Open
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

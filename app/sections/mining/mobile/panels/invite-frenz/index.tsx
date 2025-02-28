import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useReferStore } from "@/app/store/useRefer";
import { useAuth } from "@/app/context/auth";
import { useState } from "react";
import InfoIcon from "../info-icon";
import InviteCodes from "../../../component/invite-codes";
import useInviteCodes from "../../../use-invite-codes";

export default function InviteFrenz({ rate }: any) {
  const store = useReferStore();
  const { userInfo } = useAuth();
  const [showInviteCodes, setShowInviteCodes] = useState(false);
  const { list, loading, onCopyAll, onQuery } = useInviteCodes();
  return (
    <>
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
            <div>10 invite code</div>
            <div className={styles.ItemBottomButtons}>
              <button
                disabled={!list?.length}
                className={styles.LinkButton}
                onClick={onCopyAll}
              >
                Copy
              </button>
              {userInfo?.address ? (
                <button
                  type="button"
                  className={styles.Button}
                  onClick={() => {
                    setShowInviteCodes(true);
                  }}
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
      <InviteCodes
        show={showInviteCodes}
        list={list}
        loading={loading}
        onCopyAll={onCopyAll}
        onQuery={onQuery}
        onClose={() => {
          setShowInviteCodes(false);
        }}
      />
    </>
  );
}

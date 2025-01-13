import styles from "./index.module.css";
import Link from "next/link";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { fail, success } from "@/app/utils/toast";

export default function EarnAndInvite() {
  const { userInfo } = useAuth();
  return (
    <div className={styles.Container}>
      <div
        className={styles.Item}
        style={{
          border: " 1px solid #ffa8e8"
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
          <div className={styles.Desc}>100 likes per day</div>
          <div className={styles.Num}>100 left</div>
          <Link className={styles.Button} href="/">
            View Memes
          </Link>
        </div>
      </div>
      <div
        className={styles.Item}
        style={{
          border: " 1px solid #C9FF5D"
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
          <div className={styles.Desc}>My invite link</div>
          <div className={styles.Link}>
            {userInfo?.address
              ? `${window?.location?.origin}?referral=${userInfo.address}`
              : "-"}
          </div>
          {userInfo?.address ? (
            <button
              className={styles.Button}
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${window?.location?.origin}?referral=${userInfo.address}`
                  )
                  .then(() => {
                    success("Copied my invite link!");
                  })
                  .catch((err) => {
                    fail("Copy failed!");
                  });
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

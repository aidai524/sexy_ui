import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import CheckedIcon from "../checked-icon";
import InfoIcon from "../info-icon";

import dayjs from "dayjs";

export default function CreateToEarn({ airdropEndTime }: any) {
  const { userInfo } = useAuth();
  const router = useRouter();

  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #9AB3EF"
      }}
    >
      <div
        className={styles.ItemBg}
        style={{
          background:
            "radial-gradient(74.25% 66.17% at 63.1% 125%, #9AB3EF 0%, #0C0106 100%)"
        }}
      />
      <div className={styles.ItemContent}>
        <div className={styles.ItemHeader}>
          <div className={styles.ItemTitle}>
            <span>Create to Earn</span>
            <InfoIcon onClick={() => {}} />
          </div>
          <div className={styles.ItemSubTitle}>
            +50 <span className={styles.ThemeColor}>$FUN</span>
          </div>
        </div>
        <div className={styles.ItemDesc}>
          White listed only, until {dayjs(airdropEndTime).format("YYYY-MM-DD")}
        </div>
        <div className={styles.ItemBottom}>
          <div />
          <div className={styles.ItemBottomButtons}>
            {userInfo?.address ? (
              true ? (
                <button
                  type="button"
                  className={styles.Button}
                  onClick={() => {
                    router.push("/create");
                  }}
                >
                  Create Now
                </button>
              ) : (
                <div className={styles.Checked}>
                  <CheckedIcon />
                  <span>Created</span>
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

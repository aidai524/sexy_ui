import styles from "./index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { useUserAgent } from "@/app/context/user-agent";
import { useReferStore } from "@/app/store/useRefer";

interface InviteProps {
  rate: number;
  className?: string;
}

export const Invite = ({ rate, className }: InviteProps) => {
  const { userInfo } = useAuth();
  const { isMobile } = useUserAgent();
  const store = useReferStore();

  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #C9FF5D",
        width: isMobile ? "calc(50vw - 21px)" : '',
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
        <div className={isMobile ? styles.Title : styles.TitleLaptop}>
          <div>Like to Earn</div>
          {
            !isMobile && (
              <img src="/img/mining/icon-info.svg" alt="" className={styles.TitleIcon} />
            )
          }
        </div>
        <div className={isMobile ? styles.Desc: styles.DescLaptop}>
          Kickback Ratio {!isMobile && (<><br /><br /></>)}
        </div>
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
  );
};

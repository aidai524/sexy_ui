import styles from "./index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { useUserAgent } from "@/app/context/user-agent";
import { useReferStore } from "@/app/store/useRefer";
import clsx from 'clsx';

export const FollowX = ({ rate, className }: any) => {
  const { userInfo } = useAuth();
  const { isMobile } = useUserAgent();
  const store = useReferStore();

  const handleAuthorize = () => {
    if (!window.sexAddress) {
      //@ts-ignore
      window.connect();
      return;
    }
    // TODO src/views/Compass/hooks/useTwitterBind.ts
  };

  return (
    <div
      className={clsx(styles.Item, className)}
      style={{
        border: "1px solid #FBCA04",
        width: isMobile ? "calc(50vw - 21px)" : '',
        height: isMobile ? 142 : 70
      }}
    >
      <div
        className={styles.ItemBg}
        style={{
          background: "radial-gradient(87.3% 132.86% at 73.38% 182.86%, rgba(251, 202, 4, 0.80) 0%, rgba(12, 1, 6, 0.80) 100%)",
        }}
      />
      <div className={styles.ItemContentFollowX}>
        <div className={styles.NumFollowX}>
          Follow X
        </div>

        {userInfo?.address ? (
          <button
            type="button"
            className={styles.ButtonFollowX}
            onClick={handleAuthorize}
          >
            Authorize
          </button>
        ) : (
          <WalletModalButton className={styles.ButtonFollowX}>
            Connect
          </WalletModalButton>
        )}
      </div>
    </div>
  );
};

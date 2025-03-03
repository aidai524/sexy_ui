import styles from "../index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAuth } from "@/app/context/auth";
import { useConfig } from "@/app/store/useConfig";
import XButton from "./x-button";
import CheckedIcon from "../checked-icon";
import useTwitterBind from "@/app/hooks/use-twitter-bind";
import CircleLoading from "@/app/components/icons/loading";

export default function FollowX() {
  const { userInfo, onQueryInfo } = useAuth();
  const config = useConfig((store: any) => store.config);
  const redirectUri = `${window.location.origin}${window.location.pathname}`;
  const { loading } = useTwitterBind({
    onSuccess: () => {
      setTimeout(() => {
        onQueryInfo();
      }, 1000);
    },
    redirectUri
  });

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
              !userInfo?.twitter_user_id ? (
                <button
                  type="button"
                  className={styles.Button}
                  disabled={loading}
                  style={{ width: 104 }}
                  onClick={() => {
                    const path = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${config.TwitterClientID}&redirect_uri=${redirectUri}&scope=tweet.read%20users.read%20follows.read%20like.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
                    window.open(path, "_blank");
                  }}
                >
                  {loading ? <CircleLoading /> : "Authorize"}
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

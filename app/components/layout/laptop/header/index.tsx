import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";
import TrendBanner from "@/app/sections/trends/components/banner";
import PointsLabel from "@/app/components/points-label";

export default function Header({ userInfo, logout }: any) {
  return (
    <div className={styles.Container}>
      <TrendBanner />
      <div className={styles.Actions}>
        {userInfo?.address && <PointsLabel id="layout-points-label" />}
        <ConnectButton userInfo={userInfo} logout={logout} />
        {userInfo?.address && (
          <>
            <button
              onClick={() => {
                history.pushState({ page: "/reward" }, "Reward", "/reward");
              }}
              className="button"
              id="layout-mining"
            >
              <img src="/img/tabs/tab2-active.svg" />
            </button>
            <Messages />
          </>
        )}
      </div>
    </div>
  );
}

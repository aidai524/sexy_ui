import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";
import TrendBanner from "@/app/sections/trends/components/banner";
import PointsLabel from "@/app/components/points-label";

export default function Header({ tab, userInfo, logout }: any) {
  return (
    <div className={styles.Container}>
      <TrendBanner />
      <div className={styles.Actions}>
        <PointsLabel id="layout-points-label" />
        <ConnectButton userInfo={userInfo} logout={logout} />
        <button
          onClick={() => {
            history.pushState({ page: "/mining" }, "Mining", "/mining");
          }}
          className="button"
          id="layout-mining"
        >
          <img src="/img/tabs/tab2-active.svg" />
        </button>
        <Messages />
      </div>
    </div>
  );
}

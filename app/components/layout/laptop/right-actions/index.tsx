import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";
import PointsLabel from "@/app/components/points-label";

export default function RightActions({ userInfo, logout }: any) {
  return (
    <div className={styles.Actions}>
      {userInfo?.address && (
        <>
          <PointsLabel id="layout-points-label" />
          <Messages />
        </>
      )}
      <ConnectButton userInfo={userInfo} logout={logout} />
    </div>
  );
}

import ConnectButton from "@/app/components/connectButton";
import Messages from "@/app/components/messages";
import styles from "./index.module.css";
import PointsLabel from "@/app/components/points-label";
import SearchBar from "@/app/components/search-bar";

export default function RightActions({ userInfo, logout }: any) {
  return (
    <div className={styles.Actions}>
      {userInfo?.address && (
        <>
          <SearchBar />
          <PointsLabel id="layout-points-label" />
          <Messages />
        </>
      )}
      <ConnectButton userInfo={userInfo} logout={logout} />
    </div>
  );
}

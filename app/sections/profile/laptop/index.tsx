import Back from "@/app/components/back/laptop";
import styles from "./index.module.css";
import Vip from "@/app/components/avatar/vip";
import FollowBtn from "../components/followBtn";
import FollowerActions from "../components/follower-actions";
import Tabs from "../components/tabs";
import Address from "@/app/sections/profile/components/address";

export default function Laptop({
  userInfo,
  address,
  isFollower,
  refreshNum,
  setRefreshNum,
  onQueryInfo,
  setUserInfo,
  setShowVip,
  router,
  profileTabIndex,
  showHot = true,
  isOther = false
}: any) {
  return (
    <div className={styles.Container}>
      <div className={styles.SexyFi} />
      <div className={styles.BackWrapper}>
        <Back />
      </div>
      {userInfo && (
        <>
          <div className={styles.Top}>
            <img src={userInfo.icon} className={styles.Avatar} />
            <div className={styles.Desc}>
              <div className={styles.NameTop}>
                <div className={styles.NameWrapper}>
                  <div>{userInfo.name}</div>
                  <Vip {...{ userInfo, address, onVipShow: setShowVip }} />
                </div>
                <div className={styles.Buttons}>
                  <FollowBtn
                    address={address}
                    isFollower={isFollower}
                    onSuccess={async () => {
                      setRefreshNum(refreshNum + 1);
                      await onQueryInfo();
                      setUserInfo({
                        userInfo: userInfo
                      });
                    }}
                  />
                </div>
              </div>
              <FollowerActions
                userInfo={userInfo}
                onItemClick={() => {}}
                style={{
                  padding: "0px",
                  gap: "30px",
                  justifyContent: "start",
                  marginTop: "10px"
                }}
              />
              {address && (
                <Address
                  address={address}
                  color="#fff"
                  fontSize={12}
                  style={{
                    padding: 0,
                    width: 440
                  }}
                />
              )}
            </div>
          </div>
          <Tabs
            address={address}
            defaultIndex={profileTabIndex}
            showHot={showHot}
            from="page"
            tabContentStyle={{
              padding: "0px 30px",
              height: "calc(100vh - 400px)",
              overflowY: "auto"
            }}
          />
        </>
      )}
    </div>
  );
}

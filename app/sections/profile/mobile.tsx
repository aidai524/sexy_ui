import styles from "./profile.module.css";
import Back from "@/app/components/back";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import Address from "./components/address";
import HotBoost from "./components/hot-boost";
import FollowBtn from "./components/followBtn";
import PointsLabel from "@/app/components/points-label";
import { useReferStore } from "@/app/store/useRefer";

export default function Profile({
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
  const store = useReferStore();
  const backgroundImgStyle = userInfo?.banner
    ? {
        backgroundImage: `linear-gradient(360deg, #0D1012 41.35%, rgba(0, 0, 0, 0) 100%)`,
        backgroundSize: "100% auto"
      }
    : {};

  const backgroundImgStyle1 = userInfo?.banner
    ? {
        backgroundImage: `url(${userInfo?.banner})`,
        backgroundSize: "100% auto"
      }
    : {};

  return (
    <div
      className={styles.main}
      style={store.entryVisible ? { paddingBottom: 200 } : {}}
    >
      <div style={backgroundImgStyle1} className={styles.avatarBox}>
        <div className={styles.Points}>
          <PointsLabel reverse={true} bg="transparent" />
        </div>
        {isOther ? (
          <div className={styles.isOther}>
            <div>
              <Back style={{ left: 0, top: 0 }} />
            </div>

            <div className={styles.FollowBtnBox}>
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
        ) : null}
        <div className={styles.avatarContent} style={backgroundImgStyle}>
          <Avatar
            userInfo={userInfo}
            onVipShow={() => {
              setShowVip(true);
            }}
            onEdit={() => {
              router.push("/profile/edit");
            }}
          />
        </div>
      </div>

      <FollowerActions
        userInfo={userInfo}
        onItemClick={(action: string) => {
          router.push(
            "/profile/follower?account=" + address + "&action=" + action
          );
        }}
      />

      <Address address={address} />
      {/* {
                !isOther && <HotBoost
                    user={ownUserInfo}
                    onMoreClick={() => {
                        setShowVip(true);
                    }}
                    style={{ margin: "20px 10px" }}
                />
            } */}

      <Tabs
        address={address}
        defaultIndex={profileTabIndex}
        showHot={showHot}
        isOther={isOther}
      />
    </div>
  );
}

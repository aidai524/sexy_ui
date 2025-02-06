import styles from "./profile.module.css";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import PointsLabel from "@/app/components/points-label";
import { useReferStore } from "@/app/store/useRefer";
import { useAuth } from "@/app/context/auth";
import AirdropEntry from "@/app/components/airdrop/entry";
import PageHeader from "@/app/components/page-header/mobile";
import Summaries from "@/app/sections/profile/components/summaries";
import { AIRDROP_STAGE } from "@/app/config/airdrop";
import { SHOW_COPY_TRADE } from "@/app/utils/config";
import { useConfig } from "@/app/store/useConfig";

export default function Profile({
  userInfo,
  address,
  isFollower,
  refreshNum,
  setRefreshNum,
  onQueryInfo,
  setShowVip,
  router,
  showHot = true,
  isOther = false
}: any) {
  const configStore: any = useConfig();
  const userInfoBanner = userInfo?.banner;
  const backgroundImgStyle = userInfoBanner
    ? {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.90) 41.35%, rgba(0, 0, 0, 0.30) 100%)`,
        backgroundSize: "cover"
      }
    : {};

  const backgroundImgStyle1 = userInfoBanner
    ? {
        backgroundImage: `url(${userInfoBanner})`,
        backgroundSize: "cover"
      }
    : {};
  return (
    <div className={styles.main} style={{}}>
      <PageHeader
        title=""
        theme="light"
        from="profile"
        rightActions={
          !isOther && (
            <button
              type="button"
              className={styles.SettingButton}
              onClick={() => {
                router.push("/profile/setting");
              }}
            />
          )
        }
        isOther={isOther}
      />
      {configStore.config.showAirdropEntry && <AirdropEntry />}
      <div style={backgroundImgStyle1} className={styles.avatarBox}>
        {/*<div className={styles.Points}>
          <PointsLabel reverse={true} bg="transparent" />
        </div>*/}
        <div className={styles.avatarContent} style={backgroundImgStyle}>
          <Avatar
            userInfo={userInfo}
            onVipShow={() => {
              setShowVip(true);
            }}
            onEdit={() => {
              router.push("/profile/edit");
            }}
            address={address}
            isOther={isOther}
            isFollower={isFollower}
            onFollowSuccess={async () => {
              setRefreshNum(refreshNum + 1);
              await onQueryInfo();
              // setUserInfo({
              //   userInfo: userInfo
              // });
            }}
          />
          <FollowerActions
            userInfo={userInfo}
            onItemClick={(action: string) => {
              if (!address) return;
              router.push(
                "/profile/follower?account=" + address + "&action=" + action
              );
            }}
            style={{
              width: "100%"
            }}
          />
        </div>
      </div>

      {SHOW_COPY_TRADE && (
        <Summaries
          address={address}
          isFollower={isFollower}
          setRefreshNum={setRefreshNum}
          refreshNum={refreshNum}
          userInfo={userInfo}
          isOther={isOther}
        />
      )}

      <Tabs
        address={address}
        showHot={showHot}
        isOther={isOther}
        tabHeaderStyle={{
          flexShrink: 0,
          padding: isOther ? "10px 15px" : "10px",
          fontSize: "14px",
          marginTop: 20
        }}
        tabHeadersStyle={{
          overflowX: "auto",
          height: "unset"
        }}
        cursorStyle={{
          height: 3,
          background: "var(--part-bg)",
          borderRadius: 2,
          bottom: 0,
          width: "100%",
          filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))"
        }}
        tabContentStyle={{
          background: "rgba(255, 255, 255, 0.08)",
          minHeight: "calc(100dvh - 274px)"
        }}
      />
    </div>
  );
}

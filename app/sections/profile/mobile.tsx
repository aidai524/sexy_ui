import styles from "./profile.module.css";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import PointsLabel from "@/app/components/points-label";
import { useReferStore } from "@/app/store/useRefer";
import { useAuth } from "@/app/context/auth";
import AirdropEntry from '@/app/components/airdrop/entry';
import PageHeader from '@/app/components/page-header/mobile';
import Summaries from '@/app/sections/profile/components/summaries';

export default function Profile({
  userInfo,
  address,
  isFollower,
  refreshNum,
  setRefreshNum,
  onQueryInfo,
  setShowVip,
  router,
  profileTabIndex,
  showHot = true,
  isOther = false
}: any) {
  const store = useReferStore();
  const { logout } = useAuth();
  const userInfoBanner = userInfo?.banner;
  const backgroundImgStyle = userInfoBanner
    ? {
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.90) 41.35%, rgba(0, 0, 0, 0.30) 100%)`,
        backgroundSize: "100% auto"
      }
    : {};

  const backgroundImgStyle1 = userInfoBanner
    ? {
        backgroundImage: `url(${userInfoBanner})`,
        backgroundSize: "100% auto"
      }
    : {};

  return (
    <div
      className={styles.main}
      style={store.entryVisible ? { paddingBottom: 200 } : {}}
    >
      <PageHeader
        title=""
        theme="light"
        from="profile"
      />
      <AirdropEntry />
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
        </div>
        <FollowerActions
          userInfo={userInfo}
          onItemClick={(action: string) => {
            router.push(
              '/profile/follower?account=' + address + '&action=' + action
            );
          }}
        />
      </div>

      <Summaries />

      <Tabs
        address={address}
        defaultIndex={profileTabIndex}
        showHot={showHot}
        isOther={isOther}
        tabHeaderStyle={{
          flexShrink: 0,
          padding: '10px 15px',
          fontSize: '14px',
          marginTop: 20,
        }}
        tabHeadersClassName={styles.Tabs}
        tabHeadersStyle={{
          height: 'unset',
        }}
        cursorClassName={styles.TabsCursorClassName}
        tabContentClassName={styles.TabsContentClassName}
      />
    </div>
  );
}

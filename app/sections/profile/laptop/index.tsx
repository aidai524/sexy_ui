import Back from "@/app/components/back/laptop";
import styles from "./index.module.css";
import Vip from "@/app/components/avatar/vip";
import FollowBtn from "../components/followBtn";
import FollowerActions from "../components/follower-actions";
import Tabs from "../components/tabs";
import Address from "@/app/sections/profile/components/address";
import FollowerModal from "@/app/components/layout/laptop/user/follower-modal";
import { motion } from "framer-motion";
import Empty from "@/app/components/empty";
import { defaultAvatar } from "@/app/utils/config";
import { useState } from "react";

export default function Laptop({
  userInfo,
  address,
  isFollower,
  refreshNum,
  setRefreshNum,
  updateUserInfo,
  profileTabIndex,
  showHot = true,
  isOther
}: any) {
  const [followModalType, setFollowModalType] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Container}
    >
      <div className={styles.Flip} />
      <div className={styles.BackWrapper}>
        <Back />
      </div>
      {userInfo ? (
        <div className={styles.Content}>
          <div className={styles.Top}>
            <img
              src={userInfo.icon || defaultAvatar}
              className={styles.Avatar}
            />
            <div className={styles.Desc}>
              <div className={styles.NameTop}>
                <div className={styles.NameWrapper}>
                  <div>{userInfo.name}</div>
                  {/* <Vip {...{ userInfo, address, onVipShow: setShowVip }} /> */}
                </div>
                <div className={styles.Buttons}>
                  <FollowBtn
                    address={address}
                    isFollower={isFollower}
                    onSuccess={async () => {
                      setRefreshNum(refreshNum + 1);
                      updateUserInfo();
                    }}
                  />
                </div>
              </div>
              <FollowerActions
                userInfo={userInfo}
                onItemClick={(action: string) => {
                  setFollowModalType(action);
                }}
                style={{
                  padding: "0px",
                  gap: "30px",
                  justifyContent: "start",
                  marginTop: "10px",
                  width: 200
                }}
              />
              {address && (
                <Address
                  address={address}
                  isFull={true}
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
              height: "calc(100vh - 430px)",
              overflowY: "auto",
              flex: "0"
            }}
            tabHeaderStyle={{
              flex: 0,
              padding: "0px 16px"
            }}
            isOther={isOther}
          />
        </div>
      ) : (
        <Empty text="No Data" height="100%" />
      )}
      <FollowerModal
        address={address}
        open={!!followModalType}
        onClose={() => {
          setFollowModalType("");
        }}
        onRefresh={() => {
          setRefreshNum(refreshNum + 1);
          updateUserInfo();
        }}
        type={followModalType}
        isOther={isOther}
      />
    </motion.div>
  );
}

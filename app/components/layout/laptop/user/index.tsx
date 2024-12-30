import Bg from "./bg";
import styles from "./index.module.css";
import Title from "@/app/components/icons/logo-with-text";
import AvaterName from "./avater-name";
import FollowerActions from "@/app/sections/profile/components/follower-actions";
import Address from "@/app/sections/profile/components/address";
import HotBoost from "@/app/sections/profile/components/hot-boost";
import Tabs from "@/app/sections/profile/components/tabs";
import EditProfile from "./edit-profile";
import FollowerModal from "./follower-modal";
import VipModal from "@/app/sections/profile/components/vip-modal";

import { useState } from "react";
import Refer from "@/app/components/layout/laptop/user/refer";
import { useHomeTab } from "@/app/store/useHomeTab";

export default function User({ address, userInfo, onQueryInfo }: any) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [followModalType, setFollowModalType] = useState("");
  const [openVipModal, setOpenVipModal] = useState(false);
  const { profileTabIndex, set: setProfileTabIndex }: any = useHomeTab();

  return (
    <div className={styles.Container}>
      <Bg banner={userInfo?.banner} />
      <div className={styles.Content}>
        <div className={styles.Top}>
          <Title />
          <AvaterName
            userInfo={userInfo}
            onEdit={() => {
              setOpenEditModal(true);
            }}
          />
          <FollowerActions
            userInfo={userInfo}
            onItemClick={(type: string) => {
              setFollowModalType(type);
            }}
            style={{
              padding: "0px",
              gap: "60px",
              justifyContent: "center",
              marginTop: "20px"
            }}
          />
          {address && <Address address={address} />}
          {/* <HotBoost
            onMoreClick={() => {
              setOpenVipModal(true);
            }}
            style={{ margin: "10px" }}
          /> */}
        </div>
        <Tabs
          address={address}
          showHot={true}
          defaultIndex={profileTabIndex}
          tabContentStyle={{
            height: userInfo?.name
              ? "calc(100vh - 430px)"
              : "calc(100vh - 408px)",
            overflowY: "auto"
          }}
        />
      </div>
      <EditProfile
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
        }}
        onSuccess={() => {
          onQueryInfo();
          setOpenEditModal(false);
        }}
      />
      <FollowerModal
        address={address}
        open={!!followModalType}
        onClose={() => {
          setFollowModalType("");
        }}
        type={followModalType}
      />
      <VipModal
        show={openVipModal}
        onClose={() => {
          setOpenVipModal(false);
        }}
      />
      <Refer userInfo={userInfo} />
    </div>
  );
}

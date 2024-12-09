import Bg from "./bg";
import styles from "./index.module.css";
import Title from "@/app/components/icons/logo-with-text";
import AvaterName from "./avater-name";
import FollowerActions from "@/app/sections/profile/components/follower-actions";
import Address from "@/app/sections/profile/components/address";
import HotBoost from "@/app/sections/profile/components/hot-boost";
import Tabs from "@/app/sections/profile/components/tabs";
import EditProfile from "./edit-profile";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/sections/profile/hooks/useUserInfo";
import { useState } from "react";

export default function User() {
  const { address } = useAccount();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  const [openEditModal, setOpenEditModal] = useState(false);
  return (
    <div className={styles.Container}>
      <Bg />
      <div className={styles.Content}>
        <div className={styles.Top}>
          <Title />
          <AvaterName
            userInfo={userInfo}
            onEdit={() => {
              setOpenEditModal(true);
            }}
          />
          <FollowerActions userInfo={userInfo} onItemClick={() => {}} />
          <Address address={address} />
          <HotBoost onMoreClick={() => {}} style={{ margin: "10px" }} />
        </div>
        <Tabs
          address={address}
          showHot={true}
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
    </div>
  );
}

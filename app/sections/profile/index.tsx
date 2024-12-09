import { useRouter, usePathname } from "next/navigation";
import Tabs from "./components/tabs";
import Tab from "./components/tab";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import Address from "./components/address";
import HotBoost from "./components/hot-boost";
import styles from "./profile.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Modal } from "antd-mobile";
import BoostVip from "@/app/components/boost/boostVip";
import { httpAuthGet } from "@/app/utils";

import type { UserInfo } from "@/app/type/index";
import useUserInfo from "./hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
  showHot?: boolean;
}

export default function Profile({ showHot = true }: Props) {
  const router = useRouter();
  const { address } = useAccount();
  const { userInfo } = useUserInfo(address);

  const showVip = useCallback(() => {
    const vipHandler = Modal.show({
      content: (
        <BoostVip
          onStartVip={() => {
            vipHandler.close();
          }}
          onCanceVip={() => {
            vipHandler.close();
          }}
        />
      ),
      closeOnMaskClick: true
    });
  }, []);

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
    <div className={styles.main}>
      <div style={backgroundImgStyle1}>
        <div className={styles.avatarContent} style={backgroundImgStyle}>
          <Avatar
            userInfo={userInfo}
            onEdit={() => {
              router.push("/profile/edit");
            }}
          />
        </div>
      </div>
      <FollowerActions
        userInfo={userInfo}
        onItemClick={() => {
          router.push("/profile/follower/" + address);
        }}
      />
      <Address address={address} />
      <HotBoost onMoreClick={showVip} style={{ margin: "20px 10px" }} />
      <Tabs address={address} showHot={showHot} />
    </div>
  );
}

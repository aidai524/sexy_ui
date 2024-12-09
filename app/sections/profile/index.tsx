import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "./components/tabs";
import Avatar from "@/app/components/avatar";
import FollowerActions from "./components/follower-actions";
import Address from "./components/address";
import HotBoost from "./components/hot-boost";
import styles from "./profile.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "antd-mobile";
import BoostVip from "@/app/components/boost/boostVip";
import type { UserInfo } from "@/app/type/index";
import useUserInfo from "./hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import useFollow from "./hooks/useFollow";

interface Props {
  showHot?: boolean;
  isOther?: boolean;
}

export default function Profile({ showHot = true, isOther = false }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const { address: userAddress } = useAccount();
  const { follow } = useFollow();

  const address = useMemo(() => {
    if (isOther && params) {
      return params.get("account")?.toString();
    }

    return userAddress;
  }, [userAddress, params, isOther]);

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
        {isOther ? (
          <div className={styles.isOther}>
            <div>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_b_17_2972)">
                  <circle
                    cx="20"
                    cy="20"
                    r="20"
                    fill="black"
                    fill-opacity="0.4"
                  />
                </g>
                <path
                  d="M23.5 25.5L17.5 19L23.5 12.5"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <defs>
                  <filter
                    id="filter0_b_17_2972"
                    x="-10"
                    y="-10"
                    width="60"
                    height="60"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_17_2972"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_17_2972"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>

            <div className={styles.followerType}>
              <div
                className={styles.isFollow}
                onClick={async () => {
                  address && follow(address);
                }}
              >
                Follow
              </div>
            </div>
          </div>
        ) : null}
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

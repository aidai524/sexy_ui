import styles from "./index.module.css";
import InviteFrenz from "./invite-frenz";
import LikeToEarn from "./like-to-earn";
import FollowX from "./follow-x";
import CreateToEarn from "./create-to-earn";
import { Swiper } from "antd-mobile";
import { useConfig } from "@/app/store/useConfig";
import { useMemo } from "react";

export default function Panels({ info, rate, userInfo }: any) {
  const configStore: any = useConfig();
  const showCreateToEarn = useMemo(() => {
    return (
      configStore.AirdropStartTime <= Date.now() &&
      configStore.AirdropEndTime >= Date.now()
    );
  }, [configStore]);
  return (
    <div className={styles.Container}>
      <Swiper
        stuckAtBoundary={false}
        slideSize={82}
        defaultIndex={0}
        loop
        indicator={() => null}
      >
        <Swiper.Item>
          <InviteFrenz rate={rate} />
        </Swiper.Item>
        <Swiper.Item>
          <LikeToEarn info={info} userInfo={userInfo} />
        </Swiper.Item>
        <Swiper.Item>
          <FollowX />
        </Swiper.Item>
        {showCreateToEarn ? (
          <Swiper.Item>
            <CreateToEarn airdropEndTime={configStore.AirdropEndTime} />
          </Swiper.Item>
        ) : (
          <></>
        )}
      </Swiper>
    </div>
  );
}

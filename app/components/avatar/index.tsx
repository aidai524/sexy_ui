import styles from "./index.module.css";
import Pencil from "../icons/pencil";
import Level from "../level";
import { useAccount } from "@/app/hooks/useAccount";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import { useUserAgent } from "@/app/context/user-agent";
import FollowBtn from '@/app/sections/profile/components/followBtn';

export default function Avatar({ userInfo, onEdit, onVipShow, isOther, isFollower, onFollowSuccess }: any) {
  const { address } = useAccount();
  const { isMobile } = useUserAgent();
  // if (!userInfo?.address) {
  //   return null;
  // }

  return (
    <>
      <div className={styles.avatar} onClick={onEdit}>
        <img
          className={styles.avatarImg}
          src={userInfo?.icon || defaultAvatar}
        />
        {/*<div className={`${styles.pencil} button`}>
          <Pencil />
        </div>*/}
      </div>
      <div className={styles.userName}>
        <div>{userInfo?.name || formatAddress(userInfo?.address) || 'FlipN'}</div>
        <Level level={userInfo?.level} vipType={userInfo?.vipType} />
        {isOther && (
          <div className={styles.isOther}>
            <div className={styles.FollowBtnBox}>
              <FollowBtn
                address={address}
                isFollower={isFollower}
                onSuccess={onFollowSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

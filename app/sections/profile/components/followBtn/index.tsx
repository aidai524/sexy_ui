import { useState } from "react";
import useFollow from "../../hooks/useFollow";
import styles from "./followBtn.module.css";

interface Props {
  address?: string;
  isFollower: boolean;
  onSuccess?: () => void;
  useAnotherClassName?: boolean;
}

export default function FollowBtn({ useAnotherClassName, address, isFollower, onSuccess }: Props) {
  const { follow, unFollow } = useFollow();
  const [followLoading, setFollowLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  const getButtonClassName = (isLoading: boolean) => {
    if (useAnotherClassName) {
      return isLoading ? styles.isFollowBtnOnSumLoading : styles.FollowBtnOnSum;
    }
    return isFollower
      ? (isLoading ? styles.isFollowingLoading : styles.isFollowing)
      : (isLoading ? styles.isFollowLoading : styles.isFollow);
  };

  return (
    <div className={styles.followerType}>
      {!isFollower ? (
        <div
          className={getButtonClassName(followLoading)}
          onClick={async () => {
            if (!address) {
              return;
            }
            setFollowLoading(true);
            await follow(address);
            setTimeout(() => {
              setFollowLoading(false);
              onSuccess && onSuccess();
            }, 1200);
          }}
        >
          Follow
        </div>
      ) : (
        <div
          onClick={async () => {
            if (!address) {
              return;
            }
            setFollowingLoading(true);
            await unFollow(address);
            setTimeout(() => {
              setFollowingLoading(false);
              onSuccess && onSuccess();
            }, 1200);
          }}
          className={getButtonClassName(followingLoading)}
        >
          Following
        </div>
      )}
    </div>
  );
}

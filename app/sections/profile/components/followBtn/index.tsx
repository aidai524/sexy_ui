import { useState } from "react";
import useFollow from "../../hooks/useFollow";
import styles from "./followBtn.module.css";

interface Props {
  address?: string;
  isFollower: boolean;
  onSuccess?: () => void;
}

export default function FollowBtn({ address, isFollower, onSuccess }: Props) {
  const { follow, unFollow } = useFollow();
  const [followLoading, setFollowLoading] = useState(false);
  const [followingLoading, setFollowingLoading] = useState(false);

  return (
    <div className={styles.followerType}>
      {!isFollower ? (
        <div
          className={followLoading ? styles.isFollowLoading : styles.isFollow}
          onClick={async () => {
            if (!address) {
              return;
            }
            setFollowLoading(true);
            await follow(address);
            onSuccess && onSuccess();
            setTimeout(() => {
              setFollowLoading(false);
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
            onSuccess && onSuccess();
            setTimeout(() => {
              setFollowingLoading(false);
            }, 1200);
          }}
          className={
            followingLoading ? styles.isFollowLoading : styles.isFollowing
          }
        >
          Following
        </div>
      )}
    </div>
  );
}

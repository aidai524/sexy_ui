import styles from "./index.module.css";
import Pencil from "../icons/pencil";
import Level from "../level";
import { useAccount } from "@/app/hooks/useAccount";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import { useUserAgent } from "@/app/context/user-agent";

export default function Avatar({ userInfo, onEdit, onVipShow }: any) {
  const { address } = useAccount();
  const { isMobile } = useUserAgent();
  if (!userInfo) {
    return null;
  }

  return (
    <>
      <div className={styles.avatar} onClick={onEdit}>
        <img
          className={styles.avatarImg}
          src={userInfo?.icon || defaultAvatar}
        />
        <div className={`${styles.pencil} button`}>
          <Pencil />
        </div>
      </div>
      <div className={styles.userName}>
        <div>{userInfo?.name || formatAddress(userInfo.address)}</div>
        <Level level={userInfo.level} />
      </div>
    </>
  );
}

import styles from "./index.module.css";
import Pencil from "../icons/pencil";
import Vip from "./vip";
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
      <div className={styles.avatar}>
        <img
          className={styles.avatarImg}
          src={userInfo?.icon || defaultAvatar}
        />
        <div className={`${styles.pencil} button`} onClick={onEdit}>
          <Pencil />
        </div>
      </div>
      <div className={styles.userName}>
        <div>
          {userInfo?.name
            ? userInfo?.name
            : isMobile
            ? formatAddress(userInfo.address)
            : userInfo.address}
        </div>
        {/* <Vip {...{userInfo, address, onVipShow}}/> */}
      </div>
    </>
  );
}

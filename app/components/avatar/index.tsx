import styles from "./index.module.css";
import Pencil from "../icons/pencil";
import { useAccount } from "@/app/hooks/useAccount";
import { formatAddress } from "@/app/utils";

const defaultAvatar = '/img/avatar.png'

export default function Avatar({ userInfo, onEdit, onVipShow }: any) {
  const { address } = useAccount()

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <div className={styles.avatar}>
        <img className={styles.avatarImg} src={userInfo?.icon || defaultAvatar} />
        <div className={styles.pencil} onClick={onEdit}>
          <Pencil />
        </div>
      </div>
      <div className={styles.userName}>
        <div>{userInfo?.name ? userInfo?.name : formatAddress(userInfo.address)}</div>
        {/* <div className={styles.vipImg} onClick={() => {
          if (userInfo.address === address) {
            onVipShow && onVipShow()
          }
        }}>
          {
            Date.now() < userInfo.vipExpirationTime
              ? <img className={styles.img} src="/img/profile/vip.png" />
              : <img className={styles.img} src="/img/profile/no-vip.png" />
          }
        </div> */}
      </div>


    </>
  );
}

import styles from "./index.module.css";
import Pencil from "../icons/pencil";

const defaultAvatar = '/img/avatar.png'

export default function Avatar({ userInfo, onEdit, onVipShow }: any) {

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
        <div>{userInfo?.name}</div>
        <div className={styles.vipImg}>
          {
            userInfo?.vipType === 'vip'
              ? <img className={styles.img} src="/img/profile/vip.png" />
              : <img className={styles.img} onClick={() => { onVipShow && onVipShow() }} src="/img/profile/no-vip.png" />
          }
        </div>
      </div>


    </>
  );
}

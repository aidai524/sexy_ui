import styles from "./index.module.css";
import Pencil from "../icons/pencil";

export default function Avatar({ userInfo, onEdit }: any) {
  return (
    <>
      <div className={styles.avatar}>
        <img className={styles.avatarImg} src={userInfo?.icon} />
        <div className={styles.pencil} onClick={onEdit}>
          <Pencil />
        </div>
      </div>
      <div className={styles.userName}>{userInfo?.name}</div>
    </>
  );
}

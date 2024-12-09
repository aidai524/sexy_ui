import Avatar from "@/app/components/avatar";
import styles from "./index.module.css";

export default function AvaterName({ userInfo, onEdit }: any) {
  return (
    <div className={styles.Avatar}>
      <Avatar onEdit={onEdit} userInfo={userInfo} />
    </div>
  );
}

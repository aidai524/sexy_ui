import Avatar from "@/app/components/avatar";
import styles from "./index.module.css";

export default function AvaterName({ userInfo }: any) {
  return (
    <div className={styles.Avatar}>
      <Avatar onEdit={() => {}} userInfo={userInfo} />
    </div>
  );
}

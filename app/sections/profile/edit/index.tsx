import Back from "@/app/components/back";
import styles from "./edit.module.css";
import EditContent from "./content";
import { useRouter } from "next/navigation";

export default function ProfileEdit() {
  const router = useRouter();
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Back />
        <div className={styles.headerTitle}>Edit Profile</div>
      </div>
      <div className={styles.EditContent}>
        <EditContent
          onSuccess={() => {
            router.back();
          }}
          onClose={() => {
            router.back();
          }}
        />
      </div>
    </div>
  );
}

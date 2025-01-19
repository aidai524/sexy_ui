import styles from "./edit.module.css";
import EditContent from "./content";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/page-header/mobile";

export default function ProfileEdit() {
  const router = useRouter();

  return (
    <div className={styles.main}>
      <PageHeader
        from="create"
        style={{ position: "static" }}
        title="Edit Profile"
      />
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

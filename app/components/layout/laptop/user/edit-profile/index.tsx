import Modal from "@/app/components/modal";
import styles from "./index.module.css";
import EditContent from "@/app/sections/profile/edit/content";

export default function EditProfile({ open, onClose, onSuccess }: any) {
  return (
    <Modal open={open} onClose={onClose} mainStyle={{ width: 502 }}>
      <div className={styles.Container}>
        <div className={styles.Title}>Edit Profile</div>
        <div className={styles.Content}>
          <EditContent
            actionButtonsStyle={{
              position: "inherit",
              backgroundColor: "transparent"
            }}
            inputStyle={{
              border: "1px solid rgba(255, 255, 255, 0.3)",
              marginTop: 10,
              borderRadius: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.16)"
            }}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </div>
      </div>
    </Modal>
  );
}

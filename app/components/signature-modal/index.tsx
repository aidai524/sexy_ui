import styles from "./index.module.css";
import { initAuthorization } from "@/app/utils";
import Modal from "../modal";
import Image from "next/image";

export default function SignatureModal({
  showSignatureModal,
  updateCurrentUserInfo,
  setAccountRefresher,
  setShowSignatureModal,
  accountRefresher
}: any) {
  return (
    <Modal open={showSignatureModal}>
      <div className={styles.Container}>
        <div className={styles.Image}>
          <Image
            src="/img/titles/title.png"
            width={100}
            height={31.8}
            alt="Title"
          />
        </div>

        <div className={styles.Desc}>
          FlipN needs to verify your identity, please sign in the wallet, this
          action will not affect the asset
        </div>
        <button
          className={`${styles.Button} button`}
          onClick={async () => {
            await initAuthorization();
            updateCurrentUserInfo();
            setAccountRefresher(accountRefresher + 1);
            setShowSignatureModal(false);
          }}
        >
          Sign
        </button>
      </div>
    </Modal>
  );
}

import { Modal } from "antd-mobile";
import { useEffect } from "react";
import styles from "./login.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/navigation";
import WalletIcon from "./wallet";

interface Props {
  modalShow: boolean;
  onHide?: () => void;
}

export default function LoginModal({ modalShow, onHide }: Props) {
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      onHide && onHide();
    }
  }, [address]);

  return (
    <>
      <Modal
        visible={modalShow}
        content={
          <LoginBox
            onHide={() => {
              onHide && onHide();
              // router.replace('/')
            }}
          />
        }
        closeOnMaskClick
        closeOnAction
        onClose={() => {
          onHide && onHide();
          // router.replace('/')
        }}
        className="no-bg"
        bodyStyle={{
          backgroundColor: "#A890FF"
        }}
      />
    </>
  );
}

function LoginBox({ onHide }: any) {
  return (
    <div className={styles.main}>
      <div className={styles.tipBox}>
        <WalletIcon />

        <div className={styles.tipText}>
          Many functions need to be connected to the wallet before they can be
          used and can participate in our activities
        </div>
      </div>
      <WalletModalButton style={{ marginTop: 0 }}>
        Connect Wallet
      </WalletModalButton>

      <div
        onClick={() => {
          onHide && onHide();
        }}
        className={styles.cancelBtn}
      >
        No, Thanks
      </div>
    </div>
  );
}

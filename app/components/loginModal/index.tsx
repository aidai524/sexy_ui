import Modal from "../modal";
import { useEffect } from "react";
import styles from "./login.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/navigation";
import WalletIcon from "./wallet";
import { useAuth } from '@/app/context/auth';

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
    <Modal
      open={modalShow}
      onClose={() => {
        onHide && onHide();
        // router.replace('/')
      }}
      closeStyle={{
        display: "none"
      }}
    >
      {" "}
      <LoginBox
        onHide={() => {
          onHide && onHide();
          // router.replace('/')
        }}
      />
    </Modal>
  );
}

function LoginBox({ onHide }: any) {
  const { userInfo } = useAuth();

  return (
    <div className={styles.main}>
      <div className={styles.tipBox}>
        <WalletIcon />

        <div className={styles.tipText}>
          Many functions need to be {
          userInfo?.address ? 'connected' : (
            <WalletModalButton
              style={{
                cursor: 'default',
                width: 'unset',
                height: 'unset',
                border: 0,
                background: 'unset',
                display: 'inline',
                padding: 0,
                margin: 0,
                fontWeight: 300,
                fontSize: 14,
                color: '#fff'
              }}
              isPrivy
            >Earn</WalletModalButton>
          )
        } to the wallet before they can be used and can participate in our activities
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

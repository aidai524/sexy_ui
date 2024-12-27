import { Modal } from "antd-mobile";
import { useEffect, useState } from "react";
import styles from "./login.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import { useAccount } from "@/app/hooks/useAccount";
import { useRouter } from "next/navigation";


interface Props {
  modalShow: boolean;
  onHide?: () => void;
}

export default function LoginModal({ modalShow, onHide }: Props) {
  const { address } = useAccount();
  const router = useRouter()

  useEffect(() => {
    if (address) {
      onHide && onHide();
    }
  }, [address]);

  return (
    <>
      <Modal
        visible={modalShow}
        content={<LoginBox onHide={() => {
          onHide && onHide()
          // router.replace('/')
        }} />}
        closeOnMaskClick
        closeOnAction
        onClose={() => {
          onHide && onHide();
          // router.replace('/')
        }}
      />
    </>
  );
}

function LoginBox({ onHide }: any) {
  

  return (
    <div className={styles.main}>
      <div className={styles.tipBox}>
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle opacity="0.4" cx="36" cy="36" r="36" fill="black" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M47.5677 21.2043C46.7482 18.8369 44.1806 17.5652 41.8009 18.348L26.5433 23.3669H48.3163L47.5677 21.2043ZM19.6081 23.42L19.6211 23.4595C16.9923 23.9409 15 26.2434 15 29.0113V47.3556C15 50.473 17.5271 53 20.6444 53H50.2775C53.3948 53 55.9219 50.473 55.9219 47.3556V44.5334V31.8335V29.0113C55.9219 25.9883 53.5453 23.5203 50.5585 23.3738L49.5679 20.5119C48.3702 17.0519 44.6176 15.1932 41.1395 16.3373L19.6081 23.42ZM53.8053 31.8335V29.0113C53.8053 27.063 52.2258 25.4836 50.2775 25.4836H20.6444C18.6961 25.4836 17.1167 27.063 17.1167 29.0113V47.3556C17.1167 49.304 18.6961 50.8834 20.6444 50.8834H50.2775C52.2258 50.8834 53.8053 49.304 53.8053 47.3556V44.5334H39.6943C36.5769 44.5334 34.0499 42.0064 34.0499 38.889V37.4779C34.0499 34.3606 36.5769 31.8335 39.6943 31.8335H53.8053ZM53.8053 42.4168V33.9502H39.6943C37.7459 33.9502 36.1665 35.5296 36.1665 37.4779V38.889C36.1665 40.8374 37.7459 42.4168 39.6943 42.4168H53.8053Z"
            fill="url(#paint0_linear_4085_5924)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_4085_5924"
              x1="35.461"
              y1="16"
              x2="35.461"
              y2="53.0002"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="#FF4CCA" />
            </linearGradient>
          </defs>
        </svg>

        <div className={styles.tipText}>
          Many functions need to be connected to the wallet before they can be
          used and can participate in our mining activities
        </div>
      </div>
      <WalletModalButton style={{ marginTop: 20 }}>
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

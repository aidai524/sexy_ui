import styles from "./index.module.css";
import LoginModal from "@/app/components/loginModal";
import { useState, useEffect } from "react";

export default function Laptop({ children }: any) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // @ts-ignore
    window.connect = () => {
      setShowLoginModal(true);
    };
  }, []);

  return (
    <>
      <div className={styles.Container}>{children}</div>
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
        }}
      />
    </>
  );
}

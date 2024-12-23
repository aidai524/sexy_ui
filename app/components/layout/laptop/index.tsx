import styles from "./index.module.css";
import LoginModal from "@/app/components/loginModal";
import User from "./user";
import Header from "./header";
import { useState, useEffect } from "react";

export default function Laptop({
  userInfo,
  address,
  onQueryInfo,
  children
}: any) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // @ts-ignore
    window.connect = () => {
      setShowLoginModal(true);
    };
  }, []);

  return (
    <>
      <div className={styles.Container}>
        <User userInfo={userInfo} address={address} onQueryInfo={onQueryInfo} />
        <div className={styles.Content}>
          <Header />
          {children}
        </div>
      </div>
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
        }}
      />
    </>
  );
}

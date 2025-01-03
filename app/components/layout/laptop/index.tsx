import styles from "./index.module.css";
import LoginModal from "@/app/components/loginModal";
import User from "./user";
import Header from "./header";

export default function Laptop({
  userInfo,
  address,
  onQueryInfo,
  children,
  showLoginModal,
  setShowLoginModal
}: any) {
  return (
    <>
      <div className={styles.Container}>
        <User userInfo={userInfo} address={address} onQueryInfo={onQueryInfo} />
        <div className={styles.Content}>
          <Header />
          <div className={styles.ContentInner}>
            {children}
          </div>
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

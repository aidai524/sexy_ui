import styles from "./index.module.css";
import LoginModal from "@/app/components/loginModal";
import User from "./user";
import Header from "./header";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop/main";
import { LaptopContext } from "@/app/context/laptop";

const CreatePage = dynamic(() => import("@/app/sections/create/laptop"), {
  ssr: false
});
const TrendsPage = dynamic(() => import("@/app/sections/trends"), {
  ssr: false
});
const MiningPage = dynamic(() => import("@/app/sections/mining"), {
  ssr: false
});

const ProfileCom = dynamic(() => import("@/app/sections/profile"), {
  ssr: false
});

const DetailPage = dynamic(() => import("@/app/sections/detail"));

export default function Laptop({
  userInfo,
  address,
  onQueryInfo,
  showLoginModal,
  setShowLoginModal,
  logout
}: any) {
  const pathname = usePathname();

  return (
    <LaptopContext.Provider
      value={{
        updateUserInfo: onQueryInfo
      }}
    >
      <div className={styles.Container}>
        <User
          userInfo={userInfo}
          address={address}
          onQueryInfo={onQueryInfo}
          logout={logout}
        />
        <div className={styles.Content}>
          <Header logout={logout} />
          <div className={styles.ContentInner}>
            {pathname === "/" && <Main address={address} userInfo={userInfo} />}
            {pathname === "/create" && <CreatePage />}
            {pathname === "/trends" && <TrendsPage />}
            {pathname === "/mining" && <MiningPage />}
            {pathname === "/profile/user" && <ProfileCom isOther={true} />}
            {pathname === "/profile" && <ProfileCom />}
            {pathname === "/detail" && <DetailPage />}
          </div>
        </div>
      </div>
      <LoginModal
        modalShow={showLoginModal}
        onHide={() => {
          setShowLoginModal(false);
        }}
      />
    </LaptopContext.Provider>
  );
}

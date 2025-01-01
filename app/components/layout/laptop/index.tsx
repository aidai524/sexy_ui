import styles from "./index.module.css";
import User from "./user";
import Header from "./header";
import useUpdateInfo from "./use-update-info";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop/main";
import { LaptopContext } from "@/app/context/laptop";
import { useAuth } from "@/app/context/auth";
import useNotice from "../../../hooks/use-notice";

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

export default function Laptop() {
  const updateInfo = useUpdateInfo();
  const { userInfo, address, updateCurrentUserInfo, logout, pathname } =
    useAuth();
  useNotice();

  return (
    <LaptopContext.Provider
      value={{
        ...updateInfo
      }}
    >
      <div className={styles.Container}>
        <User
          userInfo={userInfo}
          address={address}
          onQueryInfo={updateCurrentUserInfo}
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
    </LaptopContext.Provider>
  );
}

import styles from "./index.module.css";
import User from "./user";
import Header from "./header";
import useUpdateInfo from "./use-update-info";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop/main";
import Menu from "./menu";
import { LaptopContext } from "@/app/context/laptop";
import { useAuth } from "@/app/context/auth";
import useNotice from "../../../hooks/use-notice";
import { useFullScreen } from "@/app/store/use-full-screen";
import { useUserAgent } from "@/app/context/user-agent";

const CreatePage = dynamic(() => import("@/app/sections/create/laptop"), {
  ssr: false
});
const TrendsPage = dynamic(() => import("@/app/sections/trends"), {
  ssr: false
});
const RewardPage = dynamic(() => import("@/app/sections/mining"), {
  ssr: false
});

const ProfileCom = dynamic(() => import("@/app/sections/profile"), {
  ssr: false
});

const DetailPage = dynamic(() => import("@/app/sections/detail"));

export default function Laptop({ children }: any) {
  const { innerHeight, innerWidth } = useUserAgent();
  const updateInfo = useUpdateInfo();
  const fullScreenStore: any = useFullScreen();
  const { userInfo, address, updateCurrentUserInfo, logout, pathname } =
    useAuth();
  useNotice();
  console.log(123);
  return (
    <LaptopContext.Provider
      value={{
        ...updateInfo
      }}
    >
      <div className={styles.Container}>
        <Menu />
      </div>
    </LaptopContext.Provider>
  );

  return (
    <LaptopContext.Provider
      value={{
        ...updateInfo
      }}
    >
      {fullScreenStore?.isFull ? (
        <Main address={address} userInfo={userInfo} />
      ) : (
        <div className={styles.Container}>
          <User
            userInfo={userInfo}
            address={address}
            onQueryInfo={updateCurrentUserInfo}
            logout={logout}
          />
          <div className={styles.Content}>
            <Header logout={logout} userInfo={userInfo} />
            <div className={styles.ContentInner}>
              {pathname === "/" && (
                <Main address={address} userInfo={userInfo} />
              )}
              {pathname === "/create" && <CreatePage />}
              {pathname === "/trends" && <TrendsPage />}
              {pathname === "/reward" && <RewardPage />}
              {pathname === "/profile/user" && (
                <ProfileCom
                  isOther={true}
                  updateCurrentUserInfo={updateCurrentUserInfo}
                />
              )}
              {pathname === "/profile" && (
                <ProfileCom updateCurrentUserInfo={updateCurrentUserInfo} />
              )}
              {pathname === "/detail" && <DetailPage />}
            </div>
          </div>
        </div>
      )}
    </LaptopContext.Provider>
  );
}

import styles from "./index.module.css";
import User from "./user";
import RightActions from "./right-actions";
import useUpdateInfo from "./use-update-info";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop";
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
        <RightActions logout={logout} userInfo={userInfo} />
        <Menu />
        <div className={styles.Content}>
          {pathname === "/" && <Main />}{" "}
          {pathname === "/reward" && <RewardPage />}
          {pathname === "/create" && <CreatePage />}
          {pathname === "/trends" && <TrendsPage />}
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
    </LaptopContext.Provider>
  );
}

import styles from "./index.module.css";
import RightActions from "./right-actions";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop";
import Menu from "./menu";
import { useAuth } from "@/app/context/auth";
import useNotice from "../../../hooks/use-notice";
import { useSetting } from "@/app/store/use-setting";

const CreatePage = dynamic(() => import("@/app/sections/create/laptop"));
const TrendsPage = dynamic(() => import("@/app/sections/trends"));
const RewardPage = dynamic(() => import("@/app/sections/mining"));
const ProfileCom = dynamic(() => import("@/app/sections/profile"));
const DetailPage = dynamic(() => import("@/app/sections/detail"));
const MessagePage = dynamic(() => import("@/app/sections/messages/laptop"));

export default function Laptop({ children }: any) {
  const { userInfo, address, updateCurrentUserInfo, logout, pathname } =
    useAuth();
  const settingStore: any = useSetting();
  useNotice();

  return (
    <div className={styles.Container}>
      <RightActions logout={logout} userInfo={userInfo} />
      <Menu />
      <div
        className={styles.Content}
        style={{
          width: `calc(100vw - ${settingStore.menuExpand ? 160 : 62}px)`
        }}
      >
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
        {pathname === "/messages" && <MessagePage />}
      </div>
    </div>
  );
}

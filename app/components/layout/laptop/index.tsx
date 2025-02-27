import styles from "./index.module.css";
import RightActions from "./right-actions";
import dynamic from "next/dynamic";
import Main from "@/app/sections/home/laptop";
import Menu from "./menu";
import { useAuth } from "@/app/context/auth";
import useNotice from "../../../hooks/use-notice";
import { useSetting } from "@/app/store/use-setting";
import Refer from '@/app/components/layout/laptop/user/refer';

const CreatePage = dynamic(() => import("@/app/sections/create/laptop"));
const MemesPage = dynamic(() => import("@/app/sections/memes"));
const RewardPage = dynamic(() => import("@/app/sections/mining"));
const ProfileCom = dynamic(() => import("@/app/sections/profile"));
const DetailPage = dynamic(() => import("@/app/sections/detail"));
const MessagePage = dynamic(() => import("@/app/sections/messages/laptop"));
const SmartPage = dynamic(() => import("@/app/smart/page"));
const SmartTopDetailPage = dynamic(() => import("@/app/smartTopDetail/page"));
const SmartDetailPage = dynamic(() => import("@/app/smartDetail/page"));
const InviteCodeView = dynamic(() => import("@/app/sections/invite-code"));

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
        {pathname === "/smart" && <SmartPage />}
        {pathname === "/memes" && <MemesPage />}
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
        {pathname === "/smartTopDetail" && <SmartTopDetailPage />}
        {pathname === "/smartDetail" && <SmartDetailPage />}
        {pathname === "/invite-code" && <InviteCodeView />}
      </div>
      <Refer userInfo={userInfo} />
    </div>
  );
}

import User from "./user";
import Content from "./content";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/sections/profile/hooks/useUserInfo";
import styles from "./index.module.css";
export default function Laptop() {
  const { address } = useAccount();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  return (
    <div className={styles.Container}>
      <User address={address} userInfo={userInfo} onQueryInfo={onQueryInfo} />
      <Content address={address} userInfo={userInfo} />
    </div>
  );
}

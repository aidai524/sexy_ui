import User from "./user";
import Main from "./main";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/hooks/useUserInfo";
import styles from "./index.module.css";
export default function Laptop() {
  const { address } = useAccount();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  return (
    <div className={styles.Container}>
      <User address={address} userInfo={userInfo} onQueryInfo={onQueryInfo} />
      <Main address={address} userInfo={userInfo} />
    </div>
  );
}

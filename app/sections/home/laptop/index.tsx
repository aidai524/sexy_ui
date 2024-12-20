import Main from "./main";
import { useAccount } from "@/app/hooks/useAccount";
import useUserInfo from "@/app/hooks/useUserInfo";

export default function Laptop() {
  const { address } = useAccount();
  const { userInfo, onQueryInfo } = useUserInfo(address);
  return <Main address={address} userInfo={userInfo} />;
}

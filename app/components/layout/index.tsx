import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/sections/profile/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";


export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address } = useAccount()
  const userStore: any = useUser()
  const { userInfo } = useUserInfo(address)

  useEffect(() => {
    if (address && userInfo) {
      userStore.set(userInfo)
    }
  }, [userInfo, address])
  

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

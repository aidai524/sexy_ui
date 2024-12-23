import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useConfig } from "@/app/store/useConfig";
import { httpGet } from "@/app/utils";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address } = useAccount();
  const userStore: any = useUser();
  const configStore: any = useConfig()
  const { userInfo, onQueryInfo } = useUserInfo(address);

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });
    }
  }, [userInfo, address]);

  useEffect(() => {
    httpGet('/config').then(res => {
      if (res.code === 0) {
        configStore.set({
          config: res.data
        })
      }
    })
  }, [])

  return isMobile ? (
    <Mobile {...props} />
  ) : (
    <Laptop
      {...props}
      {...{
        userInfo,
        address,
        onQueryInfo
      }}
    />
  );
}

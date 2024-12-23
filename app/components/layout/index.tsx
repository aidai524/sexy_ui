import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "@/app/hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const { address } = useAccount();
  const userStore: any = useUser();
  const { userInfo, onQueryInfo } = useUserInfo(
    "FfNH9c8ebwPZjdt1JHtAcr3yVUJLo7XpC5sXt89FpWQE"
  );

  useEffect(() => {
    if (address && userInfo) {
      userStore.set({
        userInfo: userInfo
      });
    }
  }, [userInfo, address]);

  return isMobile ? (
    <Mobile {...props} />
  ) : (
    <Laptop
      {...props}
      {...{
        userInfo,
        address: "FfNH9c8ebwPZjdt1JHtAcr3yVUJLo7XpC5sXt89FpWQE",
        onQueryInfo
      }}
    />
  );
}

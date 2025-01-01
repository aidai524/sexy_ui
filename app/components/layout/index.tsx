import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useConfig } from "@/app/store/useConfig";
import { httpGet } from "@/app/utils";
import { useEffect } from "react";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { AuthProvider } from "@/app/context/auth";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 6
  });

  useEffect(() => {
    httpGet("/config").then((res) => {
      if (res.code === 0) {
        configStore.set({
          config: res.data
        });
      }
    });

    getConfig().then((stateData) => {
      setPrepaidDelayTime(stateData.prepaidWithdrawDelayTime.toNumber() * 1000);
    });
  }, []);

  return (
    <AuthProvider>
      {isMobile ? <Mobile {...props} /> : <Laptop {...props} />}
    </AuthProvider>
  );
}

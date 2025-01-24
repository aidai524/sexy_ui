import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";
import { useConfig } from "@/app/store/useConfig";
import { httpGet } from "@/app/utils";
import { useEffect } from "react";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import { AuthProvider } from "@/app/context/auth";
import { MessageProvider } from "@/app/context/messages";
import { MessageContextProvider } from "@/app/context/messageContext";
import AirdropEntry from "@/app/components/airdrop/entry";
import { usePathname } from "next/navigation";
import { useWhitelist } from "@/app/components/airdrop/hooks/use-whitelist";
import { AIRDROP_STAGE } from "@/app/config/airdrop";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();
  const pathname = usePathname();
  useWhitelist();

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 6,
    loadData: false
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
      setPrepaidDelayTime(
        stateData.prepaidWithdrawDelayTime?.toNumber() * 1000
      );
    });
  }, []);

  return (
    <AuthProvider>
      <MessageProvider>
        <MessageContextProvider>
          {isMobile ? (
            <Mobile {...props} />
          ) : [AIRDROP_STAGE.PREVIEW.path].includes(pathname) ? (
            props.children
          ) : (
            <Laptop {...props} />
          )}
          {AIRDROP_STAGE.PREVIEW.isStage && (
            <AirdropEntry isMobile={isMobile} />
          )}
        </MessageContextProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

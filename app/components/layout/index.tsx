import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop/index";
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
import { AirdropContextProvider } from '@/app/context/airdrop';

const UnWrappedPath = [
  AIRDROP_STAGE.PREVIEW.path,
  "/invite-code",
  "/policy/privacy",
  "/policy/terms"
];

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();
  const pathname = usePathname();

  // useWhitelist();

  const { getConfig } = useTokenTrade({
    tokenName: "",
    tokenSymbol: "",
    tokenDecimals: 6,
    loadData: false
  });

  useEffect(() => {
    httpGet("/config").then((res) => {
      if (res.code === 0) {
        const showAirdropEntry =
          res.data.AirdropStartTime &&
          Date.now() + AIRDROP_STAGE.PREVIEW.endTime >
            res.data.AirdropStartTime;

        const airdropReady = Date.now() > res.data.AirdropStartTime;

        configStore.set({
          config: {
            ...res.data,
            showAirdropEntry,
            airdropReady
          }
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
          <AirdropContextProvider>
            {isMobile ? (
              <Mobile {...props} />
            ) : UnWrappedPath.includes(pathname) ? (
              props.children
            ) : (
              <Laptop {...props} />
            )}
            {configStore.config.showAirdropEntry && (
              <AirdropEntry isMobile={isMobile} />
            )}
          </AirdropContextProvider>
        </MessageContextProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

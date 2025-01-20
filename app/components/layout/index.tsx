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
import AirdropEntry from '@/app/components/airdrop/entry';
import { usePathname, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useAccount } from '@/app/hooks/useAccount';

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();
  const configStore: any = useConfig();
  const { prepaidDelayTime, setPrepaidDelayTime } = usePrepaidDelayTimeStore();
  const router = useRouter();
  const pathname = usePathname();

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

  useEffect(() => {
    // Check if the current time is earlier than the start time
    // If so, redirect to the airdrop page
    // otherwise, go to the homepage
    const { AirdropStartTime } = configStore.config || {};
    const CurrentTime = dayjs();
    if (AirdropStartTime && dayjs(CurrentTime).isBefore(dayjs(AirdropStartTime))) {
      if (pathname !== '/airdrop') {
        router.replace("/airdrop");
      }
    }
  }, [configStore.config, pathname]);

  return (
    <AuthProvider>
      <MessageProvider>
        <MessageContextProvider>
          {
            isMobile ? (
              <Mobile {...props} />
            ) : (
              ["/airdrop"].includes(pathname) ? (
                props.children
              ) : (
                <Laptop {...props} />
              )
            )
          }
          <AirdropEntry isMobile={isMobile} />
        </MessageContextProvider>
      </MessageProvider>
    </AuthProvider>
  );
}

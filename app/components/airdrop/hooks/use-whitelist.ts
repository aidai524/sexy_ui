import { httpGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect } from "react";
import { useConfig } from "@/app/store/useConfig";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { AIRDROP_STAGE } from "@/app/config/airdrop";
import { useDebounceFn } from "ahooks";

export function useWhitelist() {
  const { address } = useAccount();
  const { config }: any = useConfig();
  const router = useRouter();
  const pathname = usePathname();

  const { AirdropStartTime } = config || {};

  const checkWhiteList = async () => {
    try {
      const res = await httpGet("/wait_list/address", {
        address
      });
      const _isWhitelist = !(res.code !== 0 || !res.data || !res.data.address);

      return _isWhitelist;
    } catch (err: any) {
      err.log(err);
    }
    return false;
  };

  const redirect2Airdrop = () => {
    if (pathname !== AIRDROP_STAGE.PREVIEW.path) {
      router.replace(AIRDROP_STAGE.PREVIEW.path);
    }
  };

  const redirect2Whitelist = () => {
    if (pathname !== AIRDROP_STAGE.WHITELIST.path) {
      router.replace(AIRDROP_STAGE.WHITELIST.path);
    }
  };

  const { run: checkAirdrop, cancel: checkAirdropCancel } = useDebounceFn(
    async () => {
      if (!AirdropStartTime) {
        return;
      }

      const CurrentTime = dayjs();
      const StartTime = dayjs(AirdropStartTime);
      const isBeforeAirdrop = dayjs(CurrentTime).isBefore(StartTime);

      // airdrop not started
      if (isBeforeAirdrop) {
        if (!address) {
          return;
        }

        if (process.env.NEXT_PUBLIC_NET === 'Devnet') {
          return
        }

        const isWhitelist = await checkWhiteList();

        if (!isWhitelist) {
          redirect2Whitelist();
          return;
        }
      }
    },
    { wait: 600 }
  );

  useEffect(() => {
    checkAirdropCancel();
    checkAirdrop();
  }, [address, AirdropStartTime, pathname]);

  return {
    checkWhiteList
  };
}

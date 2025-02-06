import { httpGet } from "@/app/utils";
import { useAccount } from "@/app/hooks/useAccount";
import { useEffect, useRef } from 'react';
import { useConfig } from "@/app/store/useConfig";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { AIRDROP_STAGE } from "@/app/config/airdrop";
import { useDebounceFn } from "ahooks";
import { success } from '@/app/utils/toast';

export function useWhitelist() {
  const { address } = useAccount();
  const { config }: any = useConfig();
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<any>(0);

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

  const copyUserAddress = () => {
    return new Promise((resolve) => {
      try {
        navigator.clipboard
          .writeText(address || '')
          .then(() => {
            success("Your wallet address has been copied to the clipboard!", { maskStyle: { zIndex: 2000 } });
            timer.current = setTimeout(() => {
              clearInterval(timer.current);
              resolve(true);
            }, 2000);
          })
          .catch((err) => {
            console.log('wallet address copied failed: %o', err);
            resolve(false);
          });
      } catch (err: any) {
        console.log('wallet address copied failed: %o', err);
        resolve(false);
      }
    });
  };

  const redirect2Whitelist = async () => {
    if (pathname !== AIRDROP_STAGE.WHITELIST.path) {
      await copyUserAddress();
      router.replace(AIRDROP_STAGE.WHITELIST.path + '?address=' + address);
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

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  return {
    checkWhiteList
  };
}

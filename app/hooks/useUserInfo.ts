import type { UserInfo } from "@/app/type";
import { httpAuthGet, httpAuthPost } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReferStore } from "@/app/store/use-user-info";

export default function useUserInfo(
  address: string | undefined,
  isSelf = false,
  accountRefresher?: number
) {
  const { info, setInfo } = useReferStore();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(true);

  const userInfoShown = useMemo(() => {
    if (userInfo) return userInfo;
    return info[address || "default"];
  }, [info, userInfo]);

  const handleUserInfo = (_userInfo: UserInfo) => {
    setUserInfo(_userInfo);
    setInfo(address, _userInfo);
  };

  const onQueryInfo = useCallback(async () => {
    if (address) {
      setIsLoading(true);
      const _userInfo = await fecthUserInfo(address);
      if (_userInfo) {
        handleUserInfo(_userInfo);
      }
      setIsLoading(false);
    }
  }, [address]);

  const fecthUserInfo = async (address: string) => {
    return httpAuthGet("/account", { address: address }).then((res) => {
      if (res.code === 0 && res.data) {
        return {
          name: res.data.name,
          address,
          icon: res.data.icon,
          banner: res.data.banner,
          followers: res.data.followers,
          following: res.data.following,
          likeNum: res.data.like_num,
          boostNum: res.data.boost_num,
          usingBoostNum: res.data.using_boost_num,
          superLikeNum: res.data.super_like_num,
          usingSuperLikeNum: res.data.using_super_like_num,
          usingBuySuperLikeNum: res.data.using_buy_super_like_num,
          vipType: res.data.vip_type,
          education: res.data.education,
          vipExpirationTime: res.data.vip_expiration_time,
          vipStartTime: res.data.vip_start_time,
          proxyFee: res.data.proxy_fee,
          referralFee: res.data.referral_fee,
          level: res.data.level
        };
      }

      return null;
    });
  };

  useEffect(() => {
    if (address && !isSelf) {
      onQueryInfo();
    }
    if (isSelf && accountRefresher) {
      onQueryInfo();
    }
  }, [address, accountRefresher, isSelf]);

  async function saveUserInfo(
    banner: string,
    icon: string,
    name: string,
    education: string
  ) {
    const querys: any = {
      address,
      banner,
      name,
      icon,
      education
    };

    const queryStr = Object.keys(querys)
      .map((key) => `${key}=${encodeURIComponent(querys[key])}`)
      .join("&");

    const val = await httpAuthPost("/account?" + queryStr);
    if (val.code === 0) {
      success("");
      return true;
    } else {
      fail(val.message);
    }

    return false;
  }

  return {
    userInfo: userInfoShown,
    isLoading,
    saveUserInfo,
    fecthUserInfo,
    onQueryInfo,
    setUserInfo: handleUserInfo
  };
}

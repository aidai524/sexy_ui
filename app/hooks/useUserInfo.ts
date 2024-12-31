import type { UserInfo } from "@/app/type";
import { httpAuthGet, httpAuthPost, httpAuthPut } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import { useCallback, useEffect, useState } from "react";

export default function useUserInfo(address: string | undefined) {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const onQueryInfo = useCallback(async () => {
    if (address) {
      const userInfo = await fecthUserInfo(address);
      if (userInfo) {
        setUserInfo(userInfo);
      }
    }
  }, [address]);

  const fecthUserInfo = async (address: string) => {
    return httpAuthGet("/account", { address: address }).then((res) => {
      if (res.code === 0 && res.data) {
        const userInfo = {
          name: res.data.name,
          address: res.data.address,
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
          referralFee: res.data.referral_fee
        };

        return userInfo;
      }

      return null;
    });
  };

  useEffect(() => {
    if (address) {
      onQueryInfo();
    }
  }, [address]);

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
    userInfo,
    saveUserInfo,
    fecthUserInfo,
    onQueryInfo,
    setUserInfo
  };
}

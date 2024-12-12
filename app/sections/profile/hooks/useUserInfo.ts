import type { UserInfo } from "@/app/type";
import { httpAuthGet, httpAuthPost, httpAuthPut } from "@/app/utils";
import { success } from "@/app/utils/toast";
import { fail } from "assert";
import { useCallback, useEffect, useState } from "react";

export default function useUserInfo(address: string | undefined) {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const onQueryInfo = useCallback(async () => {
    if (address) {
        httpAuthGet("/account", { address: address }).then((res) => {
            if (res.code === 0) {
              setUserInfo({
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
              });
            }
          });
    }
    
  }, [address]);

  useEffect(() => {
    if (address) {
      onQueryInfo();
    }
  }, [address]);

  async function saveUserInfo(banner: string, icon: string, name: string, education: string) {
    const querys: any = {
      address,
      banner,
      name,
      icon,
      education,
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
    onQueryInfo
  };
}

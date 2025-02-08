
import { httpAuthGet } from '@/app/utils';
export const fecthUserInfo = async (address: string) => {
    return httpAuthGet("/account", { address: address }).then((res) => {
      if (res.code === 0 && res.data) {
        return {
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
          referralFee: res.data.referral_fee,
          level: res.data.level,
        };
      }

      return null;
    });
  };
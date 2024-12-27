import type { Project, UserInfo } from "../type";

export function mapDataToProject(currentToken: any): Project {
    return {
      id: currentToken.id,
      address: currentToken.address,
      tokenName: currentToken.token_name,
      tokenSymbol: currentToken.token_symbol,
      ticker: currentToken.ticker,
      about: currentToken.about_us,
      website: currentToken.website,
      tokenIcon: currentToken.icon || currentToken.video,
      tokenImg: currentToken.video || currentToken.icon,
      tokenDecimals: currentToken.token_decimals,
      isLike: currentToken.is_like,
      isUnLike: currentToken.isUnLike,
      isSuperLike: currentToken.isSuperLike,
      like: currentToken.like,
      unLike: currentToken.un_like,
      superLike: currentToken.super_like,
      time: currentToken.time,
      account: currentToken.account,
      creater: currentToken.account_data,
      boostTime: currentToken.boost_time,
      status: currentToken.status,
      createdAt: new Date(currentToken.created_at).getTime(),
      DApp: currentToken.DApp,
      initiativeLaunching: currentToken.initiative_launching,
      prePaidAmount: currentToken.pre_paid_amount,
    };
}

export function mapDataToUser(item: any): UserInfo {
    return {
        name: item.name,
        address: item.address,
        icon: item.icon,
        banner: item.banner,
        followers: item.followers,
        following: item.following,
        likeNum: item.like_num,
        boostNum: item.boost_num,
        usingBoostNum: item.using_boost_num,
        superLikeNum: item.super_like_num,
        usingSuperLikeNum: item.using_super_like_num,
        usingBuySuperLikeNum: item.using_buy_super_like_num,
        vipType: item.vip_type,
        isFollower: item.is_follower,
      }
}
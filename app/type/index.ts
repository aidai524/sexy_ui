export interface Project {
    id?: number;
    tokenName: string;
    tokenSymbol?: string;
    ticker: string;
    about: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    tokenImg: string;
    tokenIcon?: string;
    isLike?: boolean;
    isUnLike?: boolean;
    isSuperLike?: boolean;
    like?: number;
    unLike?: number;
    superLike?: number;
    time?: number;
    account?: string;
    boostTime?: number;
    address?: string;
    creater?: any;
}

export interface Comment {
    address: string;
    projectId: number;
    text: string;
    id: number;
    isLike: boolean;
    isUnlike: boolean;
    like: number;
    unLike: number;
    time: number;
    creater?: any,
}

export interface UserInfo {
    address: string;
    name: string;
    icon: string;
    banner: string;
    followers: number;
    following: number;
    likeNum: number;
    boostNum: number;
    usingBoostNum: number;
    superLikeNum: number;
    usingSuperLikeNum: number;
    usingBuySuperLikeNum: number;
    vipType: string;
    education?: string;
}


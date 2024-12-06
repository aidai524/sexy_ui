export interface Project {
    id?: number;
    tokenName: string;
    ticker: string;
    about: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    tokenImg: string;
    tokenSymbol?: string;
    isLike?: boolean;
    isUnLike?: boolean;
    isSuperLike?: boolean;
    like?: number;
    unLike?: number;
    superLike?: number;
    time?: number;
    account?: string;
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
}


import { useEffect, useState } from "react"
import { httpAuthDelete, httpAuthGet, httpAuthPost } from "@/app/utils"
import { fail, success } from "@/app/utils/toast"

export default function useFollow(account?: string) {
    const [freshNum, setFreshNum] = useState(0)
    const [followingList, setFollowingList] = useState([])
    const [followerList, setFollowerList] = useState([])


    useEffect(() => {
        if (account) {
            httpAuthGet('/account/follower/list', {
                address: account,
                limit: 50,
            }).then(res => {
                if (res.code === 0) {
                    const followingList = res.data.list.map((item: any)=> {
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
                            isFoller: item.is_follower,
                        }
                    })

                    setFollowingList(followingList)
                }
            })
        }
    }, [account, freshNum])

    useEffect(() => {
        if (account) {
            httpAuthGet('/follower/account/list', {
                address: account,
                limit: 50,
            }).then(res => {
                if (res.code === 0) {
                    const followerList = res.data.list.map((item: any)=> {
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
                            isFoller: item.is_follower,
                        }
                    })

                    setFollowerList(followerList)
                }
            })
        }
    }, [account, freshNum])

    async function follow(address: string) {
        const val = await httpAuthPost('/account/follower?address=' + address)
        if (val.code === 0) {
            success('Follow success')
            setFreshNum(freshNum + 1)
        } else {
            fail('Follow fail')
        }
    }

    async function unFollow(address: string) {
        const val = await httpAuthDelete('/account/follower?address=' + address)
        if (val.code === 0) {
            success('UnFollow success')
            setFreshNum(freshNum + 1)
        } else {
            fail('UnFollow fail')
        }
    }

    return {
        followingList,
        followerList,
        follow,
        unFollow,
        update: () => {
            setFreshNum(freshNum + 1)
        }
    }
}
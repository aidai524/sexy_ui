import type { UserInfo } from "@/app/type";
import styles from "./follow.module.css";
import { formatAddress, httpAuthGet } from "@/app/utils";
import { useRouter } from "next/navigation";
import FollowBtn from "../../../components/followBtn";
import Empty from "@/app/components/empty";
import { useUser } from "@/app/store/useUser";
import { useUserAgent } from "@/app/context/user-agent";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapDataToUser } from "@/app/utils/mapTo";
import InfiniteScroll from "@/app/components/sexInfiniteScroll";
import { defaultAvatar } from "@/app/utils/config";

interface Props {
  followerType: number;
  refresh: number;
  onAction?: () => void;
  currentUser: UserInfo | undefined;
}

const LIMIT = 50

const url: any = {
  2: '/account/follower/list',
  1: '/follower/account/list'
}

export default function FollowerList({ followerType, currentUser, onAction, refresh }: Props) {
  const router = useRouter();
  const { userInfo }: any = useUser();
  const { isMobile } = useUserAgent();
  const [list, setList] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const firstLoad = useRef(false)

  const loadMore = useCallback((rebuild: boolean = false) => {
    return httpAuthGet(url[followerType], {
      address: currentUser?.address,
      limit: LIMIT,
      offset: rebuild ? 0 : offset,
    }).then(res => {
      if (res.code === 0) {
        setHasMore(res.data?.has_next_page || false)
        const newMapList = res.data.list.map((item: any) => {
          return mapDataToUser(item)
        })
        if (rebuild) {
          setOffset(newMapList.length)
          setList(newMapList)
        } else {
          const newList = [
            ...list,
            ...newMapList
          ]
          setOffset(newList.length)
          setList(newList)
        }
        
      }

      setIsLoading(false)
    })
  }, [offset, currentUser])

  useEffect(() => {
    if (currentUser) {
      if (firstLoad.current) {
        return 
      }
      firstLoad.current = true
      loadMore()
    }
  }, [currentUser])

  useEffect(() => {
    if (refresh > 0) {
      setOffset(0)
      loadMore(true)
    }
  }, [refresh])

return (
  <div
    className={styles.main}
    style={{
      backgroundColor: isMobile ? "rgba(255, 255, 255, 0.08)" : "transparent"
    }}
  >
    {list.map((item: any) => {
      return (
        <div className={styles.follower} key={item.address}>
          <div
            className={styles.followerContent}
            onClick={() => {
              router.push("/profile/user?account=" + item.address);
            }}
          >
            <img className={styles.img} src={item.icon || defaultAvatar} />
            <div className={styles.nameContent}>
              <div className={styles.name}>
                {item.name || formatAddress(item.address)}
              </div>
              <div className={styles.followers}>
                {item.followers} followers
              </div>
            </div>
          </div>

          <div className={styles.followerAction}>
            {userInfo.address === item.address ? (
              <div className={styles.me}>It{"'"}s me</div>
            ) : (
              <FollowBtn
                address={item.address}
                isFollower={item.isFollower}
                onSuccess={() => {
                  if (followerType === 2 && item.isFollower) {
                    let curIndex = -1
                    list.some((listItem, index) => {
                      if (listItem === item) {
                        curIndex = index
                        return true
                      }
                      return false
                    }) 

                    if (curIndex !== -1) {
                      list.splice(curIndex, 1)
                    }
                  }
                  
                  item.isFollower = !item.isFollower
                  setList([
                    ...list
                  ])
                  onAction && onAction();
                }}
              />
            )}
          </div>
        </div>
      );
    })}

    {(!list || list.length === 0) && !isLoading && <Empty height={300} text="No Data" />}

    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
  </div>
);
}

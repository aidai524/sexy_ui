import { useUser } from "@/app/store/useUser";
import { useCallback, useEffect, useRef, useState } from "react";
import { httpAuthGet } from "@/app/utils";
import { mapDataToUser } from "@/app/utils/mapTo";
import type { UserInfo } from "@/app/type";

const url: any = {
  2: "/account/follower/list",
  1: "/follower/account/list"
};

const LIMIT = 50;
export default function useFollowList({
  currentUser,
  followerType,
  refresh
}: any) {
  const { userInfo }: any = useUser();
  const [list, setList] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const firstLoad = useRef(false);
  const typeRef = useRef(1);

  const loadMore = useCallback(
    (rebuild: boolean = false) => {
      if (rebuild) {
        setIsLoading(true);
        setList([]);
      }
      return httpAuthGet(url[followerType], {
        address: currentUser?.address,
        limit: LIMIT,
        offset: rebuild ? 0 : offset
      })
        .then((res) => {
          if (res.code === 0) {
            setHasMore(res.data?.has_next_page || false);
            const newMapList = res.data.list.map((item: any) => {
              return mapDataToUser(item);
            });
            if (rebuild) {
              setOffset(newMapList.length);
              setList(newMapList);
            } else {
              const newList = [...list, ...newMapList];
              setOffset(newList.length);
              setList(newList);
            }
          }
          typeRef.current = followerType;
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    },
    [offset, currentUser, followerType]
  );

  useEffect(() => {
    if (currentUser) {
      if (firstLoad.current) {
        return;
      }
      firstLoad.current = true;
      loadMore(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (refresh > 0) {
      setOffset(0);
      loadMore(true);
    }
  }, [refresh]);

  useEffect(() => {
    if (typeRef.current !== followerType) loadMore(true);
  }, [followerType]);

  return { list, userInfo, setList, isLoading, hasMore, loadMore };
}

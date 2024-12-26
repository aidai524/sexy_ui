import { useCallback, useEffect, useState } from "react";
import Token from "../token";
import { httpGet } from "@/app/utils";
import Empty from "../empty";
import type { Project } from "@/app/type";
import { useUser } from "@/app/store/useUser";
import useUserInfo from "../../../../hooks/useUserInfo";
import { InfiniteScroll, List } from 'antd-mobile'
import { mapDataToProject } from "@/app/utils/mapTo";
import SexInfiniteScroll from "@/app/components/sexInfiniteScroll";

const urls: any = {
  created: "/project/account/list",
  hot: "/project/super_like/list",
  liked: "/project/like/list"
};

const LIMIT = 10

export default function Created({
  address,
  type,
  prepaidWithdrawDelayTime,
  from,
  hideHot = false
}: any) {
  const [list, setList] = useState<Project[]>([]);
  const [refresh, setRefresh] = useState<number>(1);
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const userStore: any = useUser();

  const { fecthUserInfo } = useUserInfo(undefined);

  useEffect(() => {
    if (address) {
      loadMore()
    }
  }, [address, type, refresh]);

  const loadMore = useCallback(() => {
    console.log(2222)

    return httpGet(urls[type], { address, limit: LIMIT, offset }).then((res) => {
      setHasMore(res.data?.has_next_page || false)
      if (res.code === 0 && res.data?.list?.length > 0) {
        const newMapList = res.data?.list.map(mapDataToProject)
        const newList = [
          ...list,
          ...newMapList,
        ]

        setOffset(newList.length)
        setList(newList);
      }
    });
  }, [address, type, offset, list])

  if (list.length === 0) {
    return <Empty msg={"No sexy coins " + type + " yet"} />;
  }

  return (
    <div>
      {list.map((item) => {
        return (
          <Token
            from={from}
            data={item}
            key={item.id}
            hideHot={hideHot}
            prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
            update={async () => {
              setRefresh(refresh + 1);
              const userInfo = await fecthUserInfo(address as string);
              console.log("userInfo:", userInfo);

              if (userInfo) {
                userStore.set({
                  userInfo
                });
              }
            }}
          />
        );
      })}

      <SexInfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
}

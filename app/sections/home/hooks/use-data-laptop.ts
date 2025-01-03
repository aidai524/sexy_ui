import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";
import { getAll, setAll } from "@/app/utils/listStore";
import { mapDataToProject } from "@/app/utils/mapTo";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";

const limit = 10;
const left_num = 5;

function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
}

export default function useData(launchType: string) {
  const [infoData2, setInfoData2] = useState<Project>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const listRef = useRef<Project[]>();
  const { accountRefresher, userInfo } = useAuth();
  const mountedRef = useRef(false);

  const queryList = async () => {
    try {
      const res = await httpGet(
        `/project/list?limit=${limit}&launchType=${launchType}`
      );
      setHasNext(res.data?.list.length === limit);
      if (res.code !== 0 || !res.data?.list) {
        return [];
      }
      const icons = res.data?.list.map((token: any) => token.icon);
      preloadImages(icons);
      return res.data?.list;
    } catch (err) {
      return [];
    }
  };

  const getnext = () => {
    if (!listRef.current) return;

    if (listRef.current.length) {
      listRef.current.shift();
      setAll(listRef.current, launchType, userInfo.address);
    }

    if (listRef.current.length) {
      setInfoData2(mapDataToProject(listRef.current[0]));
    } else {
      setAll([], launchType, userInfo.address);
      setInfoData2(undefined);
    }

    if (listRef.current.length <= left_num) {
      if (hasNext) {
        handleList(true);
      }
    }
  };

  const handleList = useCallback(
    async (isNext?: boolean) => {
      let list = getAll(launchType, userInfo?.address) || [];

      if (!isNext) setIsLoading(true);
      const fetchedList = await queryList();
      const data: Record<string, any> = {};

      list.forEach((item: any) => {
        data[item.id] = item;
      });

      fetchedList.forEach((item: any) => {
        data[item.id] = item;
        item.fetched_time = Date.now();
      });

      const _list = Object.values(data);
      _list.sort((a, b) => a.fetched_time - b.fetched_time);
      listRef.current = _list;

      if (!isNext) {
        if (_list.length === 0) {
          setInfoData2(undefined);
          setAll([], launchType, userInfo?.address);
        } else {
          setInfoData2(mapDataToProject(_list[0]));
          setAll(_list, launchType, userInfo?.address);
        }
      }
      setIsLoading(false);
    },
    [launchType, userInfo]
  );

  const onUpdateAfterExitingFull = (index: number) => {
    try {
      if (!listRef.current?.length) {
        throw new Error();
      }
      listRef.current = listRef.current?.slice(index, listRef.current.length);
      if (!listRef.current?.length) {
        throw new Error();
      }
      setInfoData2(mapDataToProject(listRef.current[0]));
      if (listRef.current.length <= left_num) {
        if (hasNext) {
          handleList(true);
        }
      }
    } catch (err) {
      setInfoData2(undefined);
    }
  };

  const initList = () => {
    let list = getAll(launchType, userInfo?.address) || [];
    if (list.length === 0) {
      handleList(false);
      return;
    }
    if (launchType === "preLaunch") {
      list = list.filter(
        (item: any) =>
          !(
            item.status !== 0 ||
            item.is_like ||
            item.is_super_like ||
            item.is_un_like
          )
      );
    }
    listRef.current = list;
    setInfoData2(mapDataToProject(list[0]));

    if (list.length <= left_num && hasNext) {
      handleList(true);
    } else {
      setIsLoading(false);
    }
  };

  const { run: debounceList } = useDebounceFn(
    () => {
      initList();
      mountedRef.current = true;
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!mountedRef.current) return;
    setInfoData2(undefined);
    initList();
  }, [launchType]);

  useEffect(() => {
    setInfoData2(undefined);
    debounceList();
  }, [accountRefresher]);

  return {
    infoData2,
    hasNext,
    isLoading,
    list: listRef,
    onUpdateAfterExitingFull,
    getnext
  };
}

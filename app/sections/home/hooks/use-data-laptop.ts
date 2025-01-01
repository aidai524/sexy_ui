import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef } from "react";
import type { Project } from "@/app/type";
import { getAll, setAll } from "@/app/utils/listStore";
import { mapDataToProject } from "@/app/utils/mapTo";

const limit = 10;
const left_num = 5;

export default function useData(launchType: string) {
  const [infoData2, setInfoData2] = useState<Project>();
  const [isLoading, setisLoading] = useState(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const listRef = useRef<Project[]>();

  const onQueryList = async (isInit: boolean) => {
    await httpGet(`/project/list?limit=${limit}&launchType=${launchType}`)
      .then((res) => {
        if (res.data?.has_next_page || res.data?.list.length === limit) {
          setHasNext(true);
        } else {
          setHasNext(false);
        }

        if (res.code !== 0 || !res.data?.list) {
          setisLoading(false);
          return;
        }
        // res.data.list = []
        let _list: any = [];
        if (isInit) {
          _list = res.data?.list;

          setInfoData2(mapDataToProject(_list[0]));
        } else {
          const newVals: any = {};
          if (listRef.current) {
            listRef.current.forEach((item: any) => {
              newVals[item.id] = item;
            });
          }

          if (res.data.list) {
            res.data.list.forEach((item: any) => {
              if (!newVals[item.id]) {
                newVals[item.id] = item;
              }
            });
          }

          _list = Object.values(newVals);
        }

        listRef.current = _list;
        setAll(listRef.current, launchType);

        if (isInit) {
          setTimeout(() => {
            setisLoading(false);
          }, 10);
        }
      })
      .catch(() => {
        setisLoading(false);
      });
  };

  const getnext = () => {
    if (!listRef.current) return;

    if (listRef.current.length) {
      listRef.current.shift();
      setAll(listRef.current, launchType);
    }

    if (listRef.current.length) {
      setInfoData2(mapDataToProject(listRef.current[0]));
    } else {
      setInfoData2(undefined);
    }

    if (listRef.current.length <= left_num) {
      if (hasNext) {
        onQueryList(false);
      }
    }
  };

  const onUpdateAfterExitingFull = (index: number) => {
    if (!listRef.current) return;
    listRef.current = listRef.current?.slice(index, listRef.current.length);
    setInfoData2(mapDataToProject(listRef.current[0]));
    setAll(listRef.current, launchType);
    if (listRef.current.length <= left_num) {
      if (hasNext) {
        onQueryList(false);
      }
    }
  };

  useEffect(() => {
    let list = getAll(launchType);

    if (list && list.length > 0) {
      if (launchType === "preLaunch") {
        list = list.filter((item: any) => {
          if (
            item.status !== 0 ||
            item.is_like ||
            item.is_super_like ||
            item.is_un_like
          ) {
            return false;
          }
          return true;
        });
        list = list || [];
      }
    }

    if (list && list.length > 0) {
      listRef.current = list;
      if (list.length === 1) {
        onQueryList(false).then(() => {
          if (listRef.current) {
            setInfoData2(mapDataToProject(listRef.current[0]));
          }
        });
      } else if (list.length <= left_num) {
        listRef.current = list;
        setInfoData2(mapDataToProject(list[0]));
        onQueryList(false);
      } else {
        setInfoData2(mapDataToProject(list[0]));
      }
      setisLoading(false);
    } else {
      onQueryList(true);
      setInfoData2(undefined);
    }
  }, [launchType]);

  return {
    infoData2,
    hasNext,
    isLoading,
    list: listRef,
    onUpdateAfterExitingFull,
    getnext
  };
}

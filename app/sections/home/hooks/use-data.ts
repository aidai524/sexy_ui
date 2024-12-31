import { httpGet, httpAuthPost } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";
import { getAll, setAll } from "@/app/utils/listStore";
import { mapDataToProject } from "@/app/utils/mapTo";

const limit = 10;
const left_num = 5;

export default function useData(launchType: string) {
  const [infoData, setInfoData] = useState<Project>();
  const [infoData2, setInfoData2] = useState<Project>();
  const [renderIndex, setRenderIndex] = useState(0);
  const [isLoading, setisLoading] = useState(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [fullList, setFullList] = useState<Project[]>();
  const listRef = useRef<Project[]>();
  const renderIndexRef = useRef<number>(0);

  const onQueryList = async (isInit: boolean) => {
    await httpGet(`/project/list?limit=${limit}&launchType=${launchType}`).then(
      (res) => {
        if (res.data?.has_next_page) {
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

          renderTwoSimple(res.data?.list);
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

          const mergedList = new Map(
            [...(listRef.current || []), ...res.data.list].map((item) => [
              item.id,
              item
            ])
          );
          _list = Object.values(newVals);
        }

        listRef.current = _list;
        setAll(listRef.current, launchType);
        setFullList(JSON.parse(JSON.stringify(_list)));

        if (isInit) {
          setTimeout(() => {
            setisLoading(false);
          }, 10);
        }
      }
    );
  };

  const renderTwoSimple = (list: Project[]) => {
    if (!list) {
      return;
    }

    if (list.length > 0) {
      const currentToken = list[0];
      setInfoData2(mapDataToProject(currentToken));
    }

    if (list.length > 1) {
      const currentToken = list[1];
      setInfoData(mapDataToProject(currentToken));
    } else {
      setInfoData(undefined);
    }
  };

  const renderTwoItems = (list: Project[]) => {
    if (!list) {
      return;
    }

    setTimeout(() => {
      if (list.length > 0) {
        if (list.length > 1) {
          renderIndexRef.current = renderIndexRef.current === 0 ? 1 : 0;
          setRenderIndex(renderIndexRef.current);
          const currentToken = list[1];
          if (renderIndexRef.current === 1) {
            setInfoData2(mapDataToProject(currentToken));
          } else {
            setInfoData(mapDataToProject(currentToken));
          }
        }

        if (list.length === 1) {
          // renderIndexRef.current = renderIndexRef.current === 0 ? 1 : 0;
          // setRenderIndex(renderIndexRef.current);
          const currentToken = list[0];
          if (renderIndexRef.current === 0) {
            setInfoData2(mapDataToProject(currentToken));
            setInfoData(undefined);
          } else {
            setInfoData2(undefined);
            setInfoData(mapDataToProject(currentToken));
          }
        }
      } else {
        setInfoData(undefined);
        setInfoData2(undefined);
      }
    }, 0);
  };

  const getnext = () => {
    if (!listRef.current) return;
    if (listRef.current.length) {
      listRef.current.shift();
      renderTwoItems(listRef.current);
      setAll(listRef.current, launchType);
    }

    if (listRef.current.length <= left_num) {
      if (hasNext) {
        onQueryList(false);
      }
    }
  };

  const updateCurrentToken = async (newTokenInfo: Project) => {
    if (renderIndexRef.current === 0) {
      setInfoData2(newTokenInfo);
    } else {
      setInfoData(newTokenInfo);
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
            renderTwoSimple(listRef.current);
          }
        });
      } else if (list.length <= left_num) {
        listRef.current = list;
        renderTwoSimple(list);
        onQueryList(false);
      } else {
        renderTwoSimple(list);
        setFullList(JSON.parse(JSON.stringify(list)));
      }
      setisLoading(false);
    } else {
      onQueryList(true);
    }
  }, [launchType]);

  return {
    infoData,
    infoData2,
    renderIndex,
    hasNext,
    isLoading,
    list: listRef,
    renderIndexRef: renderIndexRef,
    fullList,
    getnext,
    updateCurrentToken
  };
}

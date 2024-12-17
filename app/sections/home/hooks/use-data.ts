import { httpGet, httpAuthPost, mapDataToProject } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";

export default function useData(launchType: string) {
  const [infoData, setInfoData] = useState<Project>();
  const [infoData2, setInfoData2] = useState<Project>();
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [fullList, setFullList] = useState<Project[]>();
  const listRef = useRef<Project[]>();

  const onQueryList = (isInit: boolean) => {
    httpGet("/project/list?limit=50&launchType=" + launchType).then((res) => {
      if (res.data?.has_next_page) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }

      if (res.code !== 0 || !res.data?.list) return;
      let _list: any = [];
      if (isInit) {
        _list = res.data?.list;
        renderTwoItems(res.data?.list);
      } else {
        _list = [...(listRef.current || []), ...res.data.list];
      }
      listRef.current = _list;
      setFullList(JSON.parse(JSON.stringify(_list)));
    });
  };

  const renderTwoItems = useCallback((list: Project[]) => {
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
    }
  }, []);

  const getnext = () => {
    if (!listRef.current) return;
    if (listRef.current.length) {
      listRef.current.shift();
      renderTwoItems(listRef.current);
    }
    if (listRef.current.length < 10) {
      if (hasNext) {
        onQueryList(false);
      }
    }
  };

  const onLike = async () => {
    try {
      await httpAuthPost("/project/like?id=" + infoData2!.id, {});
    } catch (e) {}
  };

  const onHate = async () => {
    try {
      await httpAuthPost("/project/un_like?id=" + infoData2!.id, {});
    } catch {}
  };

  useEffect(() => {
    onQueryList(true);
  }, []);

  return {
    infoData,
    infoData2,
    hasNext,
    list: listRef,
    fullList,
    getnext,
    onLike,
    onHate
  };
}

import { httpGet, httpAuthPost, mapDataToProject } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";

export default function useData() {
  const [infoData, setInfoData] = useState<Project>();
  const [infoData2, setInfoData2] = useState<Project>();
  const [list, setList] = useState<Project[]>();
  const listRef = useRef<Project[]>();

  const onQueryList = (isInit: boolean, launchType: string) => {
    httpGet("/project/list?limit=50&launchType=" + launchType).then((res) => {
      if (res.code !== 0 || !res.data?.list) return;
      if (isInit) {
        listRef.current = res.data?.list;
        renderTwoItems(res.data?.list);
      } else {
        listRef.current = [...(listRef.current || []), ...res.data.list];
      }
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

    setList(list.slice(0, 5));
  }, []);

  const getnext = (launchType: string) => {
    if (!listRef.current) return;
    if (listRef.current.length) {
      listRef.current.shift();
      renderTwoItems(listRef.current);
    }
    if (listRef.current.length < 10) {
      onQueryList(false, launchType);
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
    onQueryList(true, 'preLaunch');
    onQueryList(true, 'launching');
  }, []);

  return { infoData, infoData2, list, getnext, onLike, onHate };
}

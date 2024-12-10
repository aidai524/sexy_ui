import { httpGet, httpAuthPost, mapDataToProject } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";

export default function useData() {
  const [infoData, setInfoData] = useState<Project>();
  const [infoData2, setInfoData2] = useState<Project>();
  const listRef = useRef<Project[]>();

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
    if (listRef.current) {
      listRef.current.shift();
      renderTwoItems(listRef.current);
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
    httpGet("/project/list?limit=50").then((res) => {
      if (res.code === 0 && res.data?.list) {
        listRef.current = res.data?.list;
        renderTwoItems(res.data?.list);
      }
    });
  }, []);

  return { infoData, infoData2, getnext, onLike, onHate };
}

import { httpGet, httpAuthPost, mapDataToProject } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";

export default function useData(launchType: string) {
  const [infoData, setInfoData] = useState<Project>();
  const [infoData2, setInfoData2] = useState<Project>();
  const [renderIndex, setRenderIndex] = useState(0)
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [fullList, setFullList] = useState<Project[]>();
  const listRef = useRef<Project[]>();
  const renderIndexRef = useRef<number>(0)

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
        // _list = [
        //   ...res.data?.list,
        //   {
        //     ...res.data?.list[0],
        //     video: 'https://pica.zhimg.com/v2-07dec33f2fd0266933f90ffe0e85a510_720w.jpg?source=172ae18b',
        //     icon: 'https://pica.zhimg.com/v2-07dec33f2fd0266933f90ffe0e85a510_720w.jpg?source=172ae18b',
        //   },
        //   {
        //     ...res.data?.list[0],
        //     video: 'https://picx.zhimg.com/v2-2212eea2ef769c7f6a8c53bf92734462_720w.jpg?source=172ae18b',
        //     icon: 'https://picx.zhimg.com/v2-2212eea2ef769c7f6a8c53bf92734462_720w.jpg?source=172ae18b',
        //   }
        // ];
       
        renderTwoSimple(res.data?.list);
      } else {
        _list = [...(listRef.current || []), ...res.data.list];
      }
      listRef.current = _list;
      setFullList(JSON.parse(JSON.stringify(_list)));
    });
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
    }
  }

  const renderTwoItems = (list: Project[]) => {
    if (!list) {
      return;
    }

    renderIndexRef.current = renderIndexRef.current === 0 ? 1: 0
    console.log('launchType: ', launchType, 'renderIndexRef.current', renderIndexRef.current)

    setRenderIndex(renderIndexRef.current)
    
    setTimeout(() => {
      if (list.length > 0) {
        const currentToken = list[0];
        if (renderIndexRef.current === 1) {
          setInfoData2(mapDataToProject(currentToken));
        } else {
          setInfoData(mapDataToProject(currentToken));
        }
      }
    }, 100)
    
  };

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
  }

  const onLike = async () => {
    try {
      if (listRef.current) {
        const infoData = listRef.current[0]
        await httpAuthPost("/project/like?id=" + infoData!.id, {});
      }
    } catch (e) {
      console.log(111222, e)
    }
  };

  const onHate = async () => {
    try {
      if (listRef.current) {
        const infoData = listRef.current[0]
        await httpAuthPost("/project/un_like?id=" + infoData!.id, {});
      }
      
    } catch {}
  };

  useEffect(() => {
    onQueryList(true);
  }, []);

  return {
    infoData,
    infoData2,
    renderIndex,
    hasNext,
    list: listRef,
    renderIndexRef: renderIndexRef,
    fullList,
    getnext,
    onLike,
    onHate
  };
}

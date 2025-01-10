import { useState, useCallback, useEffect } from "react";
import { httpGet } from "@/app/utils";
import { useDebounceFn } from "ahooks";

export default function useDanmaku({ id, limit = 10 }: any) {
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(
    (newOffset?: number) => {
      if (!id) return;
      const _offset = typeof newOffset === "number" ? newOffset : offset;

      if (_offset === 0) setIsLoading(true);
      if (_offset !== 0 && !hasMore) {
        setIsLoading(false);
        setList(JSON.parse(JSON.stringify([...list, ...list].slice(0, 4))));
        return Promise.resolve();
      }
      return httpGet("/project/comment/list", {
        limit: 10,
        project_id: id,
        offset: _offset
      })
        .then((res) => {
          if (_offset === 0) setIsLoading(false);
          if (res?.code !== 0) throw new Error();
          setHasMore(res.data?.has_next_page || false);
          let newList = [];
          if (res.data.list?.length) {
            const newMapList = res.data.list.map((item: any) => {
              return item;
            });

            if (_offset === 0) {
              newList = newMapList;
            } else {
              newList = [...list, ...newMapList];
            }
          }
          setOffset(newList.length);
          setList(newList);
        })
        .catch((err) => {
          if (_offset === 0) {
            setIsLoading(false);
            setList([]);
          }
        });
    },
    [id, offset, hasMore]
  );

  const { run: loadData } = useDebounceFn(
    (args: any = {}) => {
      if (!id) {
        setList([]);
      } else {
        loadMore(0);
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    loadData();
  }, [id]);

  return {
    isLoading,
    hasMore,
    loadMore,
    list
  };
}

import { useState, useEffect, useRef } from "react";
import { httpGet } from "@/app/utils";
import { useDebounceFn } from "ahooks";
import { numberFormatter } from "@/app/utils/common";
import { useUserAgent } from "@/app/context/user-agent";

export default function useDanmaku({ id }: any) {
  const [list, setList] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const offset = useRef(0);
  const { isWindowVisible } = useUserAgent();

  const cachedList = useRef<any>([]);

  const loadMore = async () => {
    if (!id) return;

    try {
      const res = await httpGet("/project/dan_mu/list", {
        limit: 10,
        // id: 755,
        id,
        offset: offset.current
      });

      if (res?.code !== 0) throw new Error();

      let newList: any = [];

      if (res.data.list?.length) {
        const newMapList = res.data.list.map((item: any) => {
          let text = "";
          if (["discussion"].includes(item.type)) {
            text = item.content_1;
          }
          if (item.type === "buy") {
            text = `bought ${numberFormatter(item.content_1, 4, true)} SOL`;
          }
          if (item.type === "sell") {
            text = `sold ${numberFormatter(item.content_1, 4, true)} SOL`;
          }
          if (item.type === "share") {
            text = "shared";
          }
          if (item.type === "flip") {
            text = `flipped ${numberFormatter(item.content_1, 4, true)} SOL`;
          }
          return {
            text,
            icon: item.account_icon,
            type: item.type,
            id: item.id
          };
        });

        if (offset.current === 0) {
          newList = newMapList;
          setShow(false);
          setTimeout(() => {
            setShow(true);
          }, 30);
        } else {
          newList = [...cachedList.current, ...newMapList];
        }
      }

      const _more = res.data?.has_next_page || false;
      offset.current = _more ? newList.length : 0;
      cachedList.current = newList;

      setList(newList);
      clearTimeout(window.danmakuTimer);
      window.danmakuTimer = setTimeout(
        () => {
          loadMore();
        },
        _more ? 3000 : 10000
      );
    } catch (err) {
      clearTimeout(window.danmakuTimer);
      window.danmakuTimer = setTimeout(() => {
        loadMore();
      }, 10000);
    }
  };

  const { run: loadData } = useDebounceFn(
    (args: any = {}) => {
      if (!id) {
        return;
      }
      offset.current = 0;
      clearTimeout(window.danmakuTimer);
      loadMore();
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!isWindowVisible) {
      clearTimeout(window.danmakuTimer);
      return;
    }
    setList([]);
    loadData();
  }, [id, isWindowVisible]);

  useEffect(() => {
    return () => {
      clearTimeout(window.danmakuTimer);
    };
  }, []);

  return {
    list,
    show
  };
}

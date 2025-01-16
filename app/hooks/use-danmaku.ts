import { useState, useEffect, useRef } from "react";
import { httpGet } from "@/app/utils";
import { useDebounceFn } from "ahooks";

export default function useDanmaku({ id, limit = 10 }: any) {
  const [list, setList] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const offset = useRef(0);
  const timer = useRef<any>();
  const cachedList = useRef<any>([]);

  const loadMore = async () => {
    if (!id) return;
    clearTimeout(timer.current);
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
            text = `bought ${item.content_1} SOL`;
          }
          if (item.type === "sell") {
            text = `sold ${item.content_1}`;
          }
          if (item.type === "share") {
            text = "shared";
          }
          if (item.type === "flip") {
            text = `flipped ${item.content_1} SOL`;
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

      timer.current = setTimeout(() => {
        loadMore();
      }, 10000);
    } catch (err) {
      timer.current = setTimeout(() => {
        loadMore();
      }, 10000);
    }
  };

  const { run: loadData } = useDebounceFn(
    (args: any = {}) => {
      if (!id) {
        setList([]);
      } else {
        loadMore();
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    loadData();
  }, [id]);

  return {
    loadMore,
    list,
    show
  };
}

import Fullscreen from "../../fullscreen";
import useData from "../../../hooks/use-data-laptop";
import { useEffect, useMemo, useState } from "react";
import { useFullScreen } from "@/app/store/use-full-screen";
import { useSearchParams } from "next/navigation";
import styles from "./index.module.css";
import dynamic from "next/dynamic";

const Token = dynamic(() => import("../token"));

export default function Content() {
  const fullScreenStore: any = useFullScreen();
  const [fullList, setFullList] = useState<any>([]);

  const params = useSearchParams();

  const tab = useMemo(() => {
    if (!params) return 0;
    const launchType = params.get("launchType");
    fullScreenStore.set({
      launchType
    });
    let _t = 0;
    if (launchType === "1") {
      _t = 1;
    }
    return _t;
  }, [params]);

  const type = useMemo(() => (tab ? "launching" : "preLaunch"), [tab]);

  const { infoData2, isLoading, list, getnext } = useData(type);

  useEffect(() => {
    if (fullScreenStore?.isFull) {
      setFullList(JSON.parse(JSON.stringify(list.current || [])));
    }
  }, [list.current, fullScreenStore?.isFull]);

  return (
    <div className={styles.Container}>
      {fullScreenStore?.isFull ? (
        <Fullscreen
          {...{
            list: fullList,
            isLoading,
            getnext,
            type: tab,
            onExit(index: number) {
              fullScreenStore.set({ isFull: false });
            }
          }}
        />
      ) : (
        <Token
          {...{
            infoData2,
            getnext,
            type: tab,
            isLoading,
            isFull: fullScreenStore.isFull,
            onOpenFull() {
              fullScreenStore.set({ isFull: true });
            },
            list: list.current
          }}
        />
      )}
    </div>
  );
}

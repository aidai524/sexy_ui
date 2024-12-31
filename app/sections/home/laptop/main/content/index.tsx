import Token from "../token";
import Fullscreen from "../../fullscreen";
import useData from "../../../hooks/use-data";
import { useMemo, useState } from "react";
import { useFullScreen } from "@/app/store/use-full-screen";
import { useSearchParams } from "next/navigation";
import styles from "./index.module.css";

export default function Content() {
  const fullScreenStore: any = useFullScreen();

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

  const { infoData2, fullList, isLoading, getnext } = useData(type);

  return (
    <div className={styles.Container}>
      <Token
        {...{
          infoData2,
          getnext,
          type: tab,
          isLoading,
          onOpenFull() {
            fullScreenStore.set({ isFull: true });
          }
        }}
      />
      {fullScreenStore?.isFull && (
        <Fullscreen
          {...{
            list: fullList,
            getnext,
            type,
            onExit() {
              fullScreenStore.set({ isFull: false });
            }
          }}
        />
      )}
    </div>
  );
}

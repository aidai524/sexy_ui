import Token from "../token";
import Fullscreen from "../../fullscreen";
import useData from "../../../hooks/use-data";
import { useMemo, useState } from "react";
import { useFullScreen } from "@/app/store/use-full-screen";
import styles from "./index.module.css";

export default function Content({ tab }: any) {
  const fullScreenStore: any = useFullScreen();
  const type = useMemo(() => (tab ? "launching" : "preLaunch"), [tab]);
  const { infoData2, fullList, getnext } = useData(type);

  return (
    <div className={styles.Container}>
      <Token
        {...{
          infoData2,
          getnext,
          type: tab,
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
            onExit() {
              fullScreenStore.set({ isFull: false });
            }
          }}
        />
      )}
    </div>
  );
}

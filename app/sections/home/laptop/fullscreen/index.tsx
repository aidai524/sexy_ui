import { motion } from "framer-motion";
import Title from "@/app/components/icons/logo-with-text";
import ShareIcon from "@/app/components/icons/share";
import ZoomInIcon from "@/app/components/icons/zoom-in";
import Thumbnail from "@/app/components/thumbnail";
import NextButton from "./next-button";
import TokenCardActions from "../main/token-card-actions";
import CreateButton from "../main/actions-bar/create-button";
import LaunchingActions from "@/app/components/action/launching";
import PointsLabel from "@/app/components/points-label";
import Empty from "@/app/components/empty/prelaunch";
import { shareToX } from "@/app/utils/share";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { mapDataToProject } from "@/app/utils/mapTo";

export default function Fullscreen({ list = [], getnext, onExit }: any) {
  const swaperRef = useRef<any>();
  const [index, setIndex] = useState(0);

  const data = useMemo(() => {
    if (list.length < 5) {
      return list.concat(new Array(5 - list.length).fill(null));
    }
    return list;
  }, [list]);

  const next = async (type: 0 | 1) => {
    type
      ? await actionLikeTrigger(list[index])
      : await actionHateTrigger(list[index]);
    if (index === list.length - 1) return;
    if (swaperRef.current) {
      swaperRef.current.style = "transition-duration: 0.3s;";
    }

    setIndex((prev) => prev + 1);

    setTimeout(() => {
      getnext();
    }, 1000);
  };

  useEffect(() => {
    if (list.length) {
      if (swaperRef.current) {
        swaperRef.current.style = "transition-duration: 0s;";
      }
      setIndex(0);
    }
  }, [list]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1
      }}
      className={styles.Container}
    >
      <div
        className={styles.Content}
        ref={swaperRef}
        style={{
          transform: `translateX(${-index * 478}px)`
        }}
      >
        {data.map((item: any, i: number) => {
          const token = list[index] ? mapDataToProject(list[index]) : null;

          return i <= index && token ? (
            <div className={`${styles.Item} ${styles.CurrentItem}`} key={i}>
              <Thumbnail
                showProgress={false}
                showDesc={true}
                data={token}
                autoHeight={true}
                style={{
                  height: 620,
                  margin: 0
                }}
              />
              <TokenCardActions token={token} height={620} />
              <LaunchingActions
                token={token}
                onLike={async () => {
                  await actionLikeTrigger(list[index]);
                }}
                onHate={async () => {
                  await actionHateTrigger(list[index]);
                }}
                onSuperLike={() => {}}
                onBoost={() => {}}
                style={{
                  position: "absolute",
                  gap: 14,
                  bottom: 0,
                  padding: "0px 30px"
                }}
              />
            </div>
          ) : (
            <img src={item?.icon} className={styles.Item} key={i} />
          );
        })}
      </div>
      <NextButton
        onClick={() => {
          next(0);
        }}
      />
      <Title type="primary" className={styles.Title} />
      <div className={styles.Actions}>
        <PointsLabel />
        <button
          className="button"
          onClick={() => {
            shareToX(
              list[index].tokenName,
              "https://app.flipn.fun/detail?id=" + list[index].id
            );
          }}
        >
          <ShareIcon />
        </button>
        <button className="button" onClick={onExit}>
          <ZoomInIcon />
        </button>
      </div>

      <div className={styles.Buttons}>
        <CreateButton />
      </div>
      <div
        className={styles.Layer}
        onClick={() => {
          next(0);
        }}
      >
        Click the blank area means ‘unlike’ it, and check the next one.
      </div>
      {index === list.length - 1 && (
        <div className={styles.Layer} style={{ width: "100%", zIndex: 55 }}>
          <Empty />
        </div>
      )}
    </motion.div>
  );
}

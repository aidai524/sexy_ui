import { motion } from "framer-motion";
import Title from "@/app/components/icons/logo-with-text";
import ShareIcon from "@/app/components/icons/share";
import ZoomInIcon from "@/app/components/icons/zoom-in";
import Thumbnail from "@/app/components/thumbnail";
import NextButton from "./next-button";
import TokenCardActions from "../main/token-card-actions";
import CreateButton from "../main/actions-bar/create-button";
import LaunchingActions from "@/app/components/action/launching";
import LaunchedActions from "@/app/components/action/launched";
import PointsLabel from "@/app/components/points-label";
import Empty from "@/app/components/empty/prelaunch";
import { shareToX } from "@/app/utils/share";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLaptop } from "@/app/context/laptop";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { mapDataToProject } from "@/app/utils/mapTo";

export default function Fullscreen({ list = [], onExit, type }: any) {
  const swaperRef = useRef<any>();
  const { updateInfo } = useLaptop();
  const [index, setIndex] = useState(0);

  const data = useMemo(() => {
    if (list.length < 5) {
      return list.concat(new Array(5 - list.length).fill(null));
    }
    return list;
  }, [list]);

  const next = (type?: 0 | 1) => {
    if (type !== undefined) {
      type ? actionLikeTrigger(list[index]) : actionHateTrigger(list[index]);
    }

    if (index === list.length) {
      return;
    }

    if (swaperRef.current) {
      swaperRef.current.style = "transition-duration: 0.3s;";
    }

    setIndex((prev) => prev + 1);
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
              {token &&
                (token.status === 0 ? (
                  <LaunchingActions
                    token={token}
                    canFlip={false}
                    onLike={async () => {
                      next(1);
                      updateInfo("liked");
                    }}
                    onHate={async () => {
                      next(0);
                    }}
                    onSuperLike={() => {
                      next();
                    }}
                    onBoost={() => {
                      next();
                    }}
                    style={{
                      position: "absolute",
                      gap: 14,
                      bottom: 0,
                      padding: "0px 30px"
                    }}
                  />
                ) : (
                  <LaunchedActions
                    data={token}
                    from="laptop"
                    style={{
                      position: "absolute",
                      gap: 14,
                      bottom: 0,
                      padding: "0px 30px"
                    }}
                  />
                ))}
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
        <button
          className="button"
          onClick={() => {
            onExit(index);
          }}
        >
          <ZoomInIcon />
        </button>
      </div>

      <div className={styles.Buttons}>
        <CreateButton />
      </div>
      <div
        className={`${styles.Layer}`}
        onClick={() => {
          next(0);
        }}
      >
        Click the blank area means ‘unlike’ it, and check the next one.
      </div>
      {(!list.length || index === list.length) && (
        <div className={styles.Layer} style={{ width: "100%", zIndex: 55 }}>
          <Empty type={type} />
        </div>
      )}
    </motion.div>
  );
}

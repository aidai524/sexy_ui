import { motion } from "framer-motion";
import Title from "@/app/components/icons/logo-with-text";
import ShareIcon from "@/app/components/icons/share";
import ZoomInIcon from "@/app/components/icons/zoom-in";
import Thumbnail from "@/app/components/thumbnail";
import NextButton from "./next-button";
import TokenCardActions from "../main/token-card-actions";
import CreateButton from "../main/actions-bar/create-button";
import MiningButton from "../main/actions-bar/mining-button";
import { mapDataToProject } from "@/app/utils";
import { Space, Swiper } from "antd-mobile";
import LaunchingActions from "@/app/components/action/launching";
import styles from "./index.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Fullscreen({
  list = [],
  onLike,
  onHate,
  getnext,
  onExit
}: any) {
  const swaperRef = useRef<any>();
  const [index, setIndex] = useState(0);
  const [updater, setUpdater] = useState(0);
  const data = useMemo(() => {
    if (list.length < 5) {
      return list.concat(new Array(5 - list.length).fill(null));
    }
    return list;
  }, [list]);

  const next = async (type: 0 | 1) => {
    type ? await onLike() : await onHate();
    swaperRef.current.swipeNext();
    setTimeout(() => {
      getnext();
    }, 1000);
  };

  useEffect(() => {
    if (list.length) {
      setUpdater(Date.now());
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
      <div className={styles.Content}>
        <Space direction="vertical" block>
          <Swiper
            key={updater}
            className={styles.root}
            trackOffset={0}
            slideSize={18}
            stuckAtBoundary={false}
            indicator={false}
            defaultIndex={0}
            allowTouchMove={false}
            autoplay={false}
            ref={swaperRef}
            onIndexChange={(i) => {
              setIndex(i);
            }}
          >
            {data.map((item: any, i: number) => {
              const token = list[index] ? mapDataToProject(list[index]) : null;
              return (
                <Swiper.Item key={item?.id + i}>
                  {i === index && token ? (
                    <div className={`${styles.Item} ${styles.CurrentItem}`}>
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
                      <TokenCardActions token={token} />
                      <LaunchingActions
                        token={token}
                        onLike={onLike}
                        onHate={onHate}
                        onSuperLike={() => {}}
                        onBoost={() => {}}
                        style={{
                          position: "absolute",
                          gap: 14,
                          bottom: 0
                        }}
                      />
                    </div>
                  ) : item?.icon ? (
                    <img src={item.icon} className={styles.Item} />
                  ) : (
                    <div className={styles.Item} />
                  )}
                </Swiper.Item>
              );
            })}
          </Swiper>
        </Space>
        <NextButton
          onClick={() => {
            next(0);
          }}
        />
      </div>
      <Title type="primary" className={styles.Title} />
      <div className={styles.Actions}>
        <button className="button">
          <ShareIcon />
        </button>
        <button className="button" onClick={onExit}>
          <ZoomInIcon />
        </button>
      </div>
      <div className={styles.SexyFi} />
      <div className={styles.Buttons}>
        <MiningButton />
        <CreateButton />
      </div>
      <div className={styles.Layer}>
        Click the blank area means ‘unlike’ it, and check the next one.
      </div>
    </motion.div>
  );
}

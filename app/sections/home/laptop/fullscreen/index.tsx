import { motion } from "framer-motion";
import Title from "@/app/components/icons/logo-with-text";
import ShareIcon from "@/app/components/icons/share";
import ZoomInIcon from "@/app/components/icons/zoom-in";
import Thumbnail from "@/app/components/thumbnail";
import NextButton from "./next-button";
import CreateButton from "../main/actions-bar/create-button";
import LaunchingActions from "@/app/components/action/launching";
import LaunchedActions from "@/app/components/action/launched";
import PointsLabel from "@/app/components/points-label";
import Empty from "@/app/components/empty/prelaunch";
import ConnectButton from "@/app/components/connectButton";
import TypesTabs from "@/app/sections/home/tabs";
import Refer from "@/app/components/layout/laptop/user/refer";
import { shareToX } from "@/app/utils/share";
import styles from "./index.module.css";
import { addSearchParam } from "@/app/utils/search-params";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { mapDataToProject } from "@/app/utils/mapTo";
import CircleLoading from "@/app/components/icons/loading";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { useMessage } from "@/app/context/messageContext";

export default function Fullscreen({
  list = [],
  onExit,
  type,
  isLoading,
  getnext
}: any) {
  const swaperRef = useRef<any>();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<any>([]);
  const { userInfo, logout } = useAuth();
  const splitIndex = useRef(0);
  const router = useRouter();
  const { showShare } = useMessage();

  const next = (_t?: 0 | 1) => {
    if (_t !== undefined && type !== "launching") {
      _t
        ? actionLikeTrigger(list[index], showShare)
        : actionHateTrigger(list[index]);
    }

    if (index === list.length) {
      return;
    }

    if (index > data.length - 5 && list.length > data.length - 2) {
      setData([
        ...data,
        ...list.slice(splitIndex.current, splitIndex.current + 5)
      ]);
      splitIndex.current = splitIndex.current + 5;
    }

    if (swaperRef.current) {
      swaperRef.current.style = "transition-duration: 0.3s;";
    }

    setIndex((prev) => prev + 1);

    getnext();
  };

  useEffect(() => {
    if (list.length === 0) {
      setData([]);
      return;
    }
    if (swaperRef.current) {
      swaperRef.current.style = "transition-duration: 0s;";
    }
    setIndex(0);
    if (list.length < 3) {
      setData([
        null,
        null,
        ...list.concat(new Array(3 - list.length).fill(null))
      ]);
      return;
    }
    splitIndex.current = 4;
    setData([null, null, ...list.slice(0, 4)]);
  }, [list]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1
      }}
      className={styles.Container}
    >
      <div className={styles.Wrapper}>
        <div
          className={styles.Content}
          ref={swaperRef}
          style={{
            transform: `translateX(${-index * 246}px)`
          }}
        >
          {data.map((item: any, i: number) => {
            const token = list[index] ? mapDataToProject(list[index]) : null;

            return i - 2 === index && token ? (
              <div className={`${styles.Item} ${styles.CurrentItem}`} key={i}>
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={token}
                  autoHeight={true}
                  showDropdownIcon={false}
                  style={{
                    height: 620,
                    margin: 0
                  }}
                />
                {token &&
                  (token.status === 0 ? (
                    <LaunchingActions
                      token={token}
                      canFlip={false}
                      onLike={async () => {
                        next(1);
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
                        left: 56,
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
              <img
                src={item?.icon || "/img/token-placeholder.png"}
                className={styles.Item}
                key={i}
              />
            );
          })}
        </div>
        <div className={`${styles.LeftLayer}`} />
        <div className={styles.RightLayer} />
      </div>
      <NextButton
        onClick={() => {
          next(0);
        }}
      />
      <Title type="primary" className={styles.Title} />
      <div className={styles.Actions}>
        {userInfo?.address && <PointsLabel />}
        <ConnectButton userInfo={userInfo} logout={logout} />
        {userInfo?.address && (
          <>
            <button
              className="button"
              onClick={() => {
                if (!userInfo?.address) {
                  // @ts-ignore
                  window?.connect();
                }
                shareToX(
                  list[index].tokenName,
                  "https://app.flipn.fun/detail?address=" + list[index].address
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
          </>
        )}
      </div>
      <div className={styles.Tabs}>
        <TypesTabs
          launchIndex={type}
          setLaunchIndex={(launchType: any) => {
            router.push("/?" + addSearchParam("launchType", launchType));
          }}
        />
      </div>
      <div className={styles.Refer}>
        <Refer userInfo={userInfo} />
      </div>
      <div className={styles.Buttons}>
        <CreateButton />
      </div>

      {isLoading ? (
        <div className={styles.Layer} style={{ width: "100%", zIndex: 55 }}>
          <CircleLoading size={40} />
        </div>
      ) : (
        (!list.length || index === list.length) && (
          <div className={styles.Layer} style={{ width: "100%", zIndex: 55 }}>
            <Empty
              type={type === 0 ? "preLaunch" : "launching"}
              onTextClick={() => {
                router.push(`/?launchType=${type === 0 ? 1 : 0}`);
              }}
            />
          </div>
        )
      )}
    </motion.div>
  );
}

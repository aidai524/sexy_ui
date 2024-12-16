"use client";

import ConnectButton from "@/app/components/connectButton";
import styles from "./home.module.css";
import Thumbnail from "@/app/components/thumbnail";
import LaunchingAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import Messages from "@/app/components/messages";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hammer from "hammerjs";
import useData from "../hooks/use-data";
import Tabs from "../tabs";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import useSwip from "./hooks/useSwip";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const params = useSearchParams();
  const [launchIndex, setLaunchIndex] = useState(0);
  const [actionStyle, setActionStyle] = useState<any>("");
  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger } =
    useMessage();
  const containerPreLaunchRef = useRef<any>();
  const containerLaunchedRef = useRef<any>();

  const {
    infoData: infoDataLaunching,
    infoData2: infoDataLaunching2,
    getnext: getLaunchingNext,
    hasNext: hasLaunchingNext,
    list: launchingList,
    onLike,
    onHate
  } = useData("preLaunch");

  const {
    infoData: infoDataLaunched,
    infoData2: infoDataLaunched2,
    hasNext: hasLaunchedNext,
    list: launchedList,
    getnext: getLaunchedNext
  } = useData("launching");

  useSwip(
    containerPreLaunchRef,
    () => {
      if (hateTrigger) {
        return;
      }

      setHateTrigger(true);
      hate();

      setTimeout(() => {
        setHateTrigger(false);
      }, 1600);
    },
    () => {
      if (likeTrigger) {
        return;
      }

      setLikeTrigger(true);
      like();

      setTimeout(() => {
        setLikeTrigger(false);
      }, 1600);
    },
    launchIndex === 0
  );

  useSwip(
    containerLaunchedRef,
    () => {
      justNext("hate");
    },
    () => {
      justNext("like");
    },
    launchIndex === 1
  );

  useEffect(() => {
    if (params) {
      const launchType = params.get("launchType");
      if (launchType === "0") {
        setLaunchIndex(0);
      } else if (launchType === "1") {
        setLaunchIndex(1);
      }
    } else {
      setLaunchIndex(0);
    }
  }, [params]);

  async function like() {
    console.log("launchingList111:", launchingList);
    if (
      launchingList &&
      launchingList.current &&
      launchingList.current.length > 1
    ) {
      setActionStyle(styles.like);
      setTimeout(() => {
        setActionStyle(null);
        getLaunchingNext();
      }, 1000);
    }
    onLike();
  }

  async function hate() {
    if (
      launchingList &&
      launchingList.current &&
      launchingList.current.length > 1
    ) {
      setActionStyle(styles.hate);
      setTimeout(() => {
        setActionStyle(null);
        getLaunchingNext();
      }, 1000);
    }
    onHate();
  }

  async function justNext(type: string) {
    if (
      launchedList &&
      launchedList.current &&
      launchedList.current.length > 1
    ) {
      const style = type === "like" ? styles.like : styles.hate;
      setActionStyle(style);
      setTimeout(() => {
        setActionStyle(null);

        getLaunchedNext();
      }, 1000);
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div
          onClick={() => {
            router.push("/");
          }}
        >
          <img src="/img/logo.svg" />
        </div>

        <Tabs
          launchIndex={launchIndex}
          setLaunchIndex={(launchType: any) => {
            router.push("/?launchType=" + launchType);
          }}
        />
        <div className={styles.icons}>
          {/* <ConnectButton /> */}
          <Messages />
        </div>
      </div>

      {launchIndex === 0 && (
        <>
          <div className={styles.thumbnailListBox} ref={containerPreLaunchRef}>
            {infoDataLaunching && (
              <div
                style={{ zIndex: 1 }}
                className={[styles.thumbnailBox].join(" ")}
              >
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={infoDataLaunching}
                />
              </div>
            )}

            {infoDataLaunching2 && (
              <div
                style={{ zIndex: 2 }}
                className={[styles.thumbnailBox, actionStyle].join(" ")}
              >
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={infoDataLaunching2}
                />
              </div>
            )}
          </div>

          <LaunchingAction
            token={infoDataLaunching2}
            onLike={async () => {
              like();
            }}
            onHate={async () => {
              hate();
            }}
            onSuperLike={() => {}}
            onBoost={() => {}}
          />
        </>
      )}

      {launchIndex === 1 && (
        <>
          <div className={styles.thumbnailListBox} ref={containerLaunchedRef}>
            {infoDataLaunched && (
              <div
                style={{ zIndex: 1 }}
                className={[styles.thumbnailBox].join(" ")}
              >
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={infoDataLaunched}
                />
              </div>
            )}

            {infoDataLaunched2 && (
              <div
                style={{ zIndex: 2 }}
                className={[styles.thumbnailBox, actionStyle].join(" ")}
              >
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={infoDataLaunched2}
                />
              </div>
            )}
          </div>

          {infoDataLaunched2 && <LaunchedAction data={infoDataLaunched2} />}
        </>
      )}
    </div>
  );
}

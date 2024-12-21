"use client";

import ConnectButton from "@/app/components/connectButton";
import styles from "./home.module.css";
import Thumbnail from "@/app/components/thumbnail";
import LaunchingAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import Messages from "@/app/components/messages";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useData, { FIRST_LIKE_TIMES, SECOND_LIKE_TIMES } from "../hooks/use-data";
import Tabs from "../tabs";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import useSwip from "./hooks/useSwip";
import { httpAuthGet, mapDataToProject } from "@/app/utils";
import { Modal } from "antd-mobile";
import FirstTimeLike from "../components/timesLike/firstTimeLike";
import SecondTimeLike from "../components/timesLike/secondTimesLike";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const params = useSearchParams();
  const [launchIndex, setLaunchIndex] = useState(0);
  const [actionStyle, setActionStyle] = useState<any>("");
  const [actionStyle2, setActionStyle2] = useState<any>("");
  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger } =
    useMessage();
  const containerPreLaunchRef = useRef<any>();
  const containerLaunchedRef = useRef<any>();
  const likeTriggerRef = useRef(likeTrigger)
  const hateTriggerRef = useRef(hateTrigger)
  const scrollRef = useRef(false)

  const [movingStyle, setMovingStyle] = useState({})
  const [movingStyle2, setMovingStyle2] = useState({})


  const {
    infoData: infoDataLaunching,
    infoData2: infoDataLaunching2,
    getnext: getLaunchingNext,
    hasNext: hasLaunchingNext,
    list: launchingList,
    renderIndex: renderLaunchingIndex,
    renderIndexRef: renderLaunchingIndexRef,
    onLike,
    onHate,
    updateCurrentToken: updateLaunchingToken,
  } = useData("preLaunch");

  const {
    infoData: infoDataLaunched,
    infoData2: infoDataLaunched2,
    hasNext: hasLaunchedNext,
    list: launchedList,
    getnext: getLaunchedNext,
    renderIndex: renderLaunchedIndex,
    renderIndexRef: renderLaunchedIndexRef,
    updateCurrentToken: updateLaunchedToken,
  } = useData("launching");

  useSwip(
    containerPreLaunchRef,
    () => {
      if (hateTriggerRef.current) {
        return;
      }

      setHateTrigger(true);
      hate();

      setTimeout(() => {
        setHateTrigger(false);
      }, 1600);
    },
    () => {

      if (likeTriggerRef.current) {
        return;
      }

      setLikeTrigger(true);
      like();

      setTimeout(() => {
        setLikeTrigger(false);
      }, 1600);
    },
    (percent: number) => {
      if (hateTriggerRef.current) {
        return;
      }

      console.log('preing')
      const style = {
        // opacity: percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${100 * percent}vh)`
      }
      if (renderLaunchingIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
    },
    (percent: number) => {
      if (likeTriggerRef.current) {
        return;
      }

      console.log('nexting')
      const style = {
        // opacity: percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${-100 * percent}vh)`
      }
      if (renderLaunchingIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
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
    (percent: number) => {
      if (scrollRef.current) {
        return;
      }

      console.log('preing')
      const style = {
        opacity: 1 - percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${100 * percent}vh)`
      }
      if (renderLaunchedIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
    },
    (percent: number) => {
      if (scrollRef.current) {
        return;
      }

      console.log('nexting')
      const style = {
        opacity: 1 - percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${-100 * percent}vh)`
      }
      if (renderLaunchedIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
    },
    launchIndex === 1
  );

  useEffect(() => {
    hateTriggerRef.current = hateTrigger
  }, [hateTrigger])

  useEffect(() => {
    likeTriggerRef.current = likeTrigger
  }, [likeTrigger])

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

    setActionStyle2(null);
    setActionStyle(null);
  }, [params]);

  async function like() {
    if (
      launchingList &&
      launchingList.current &&
      launchingList.current.length > 1
    ) {
      if (renderLaunchingIndexRef.current === 0) {
        setActionStyle2(styles.like);
      } else {
        setActionStyle(styles.like);
      }

      setTimeout(async () => {
        getLaunchingNext();
        setTimeout(() => {
          setActionStyle2(null);
          setActionStyle(null);
          setMovingStyle({})
          setMovingStyle2({})
        }, 100)

        const times = await onLike()
        if (times === FIRST_LIKE_TIMES) {
          if (launchingList.current) {
            const timeLikeHandler = Modal.show({
              content: <FirstTimeLike
                data={launchingList.current[0]}
                onClose={() => {
                  timeLikeHandler.close()
                }} />,
              closeOnMaskClick: true,
              className: 'no-bg'
            })
          }
        }

        if (times === SECOND_LIKE_TIMES) {
          if (launchingList.current) {
            const timeLikeHandler = Modal.show({
              content: <SecondTimeLike
                data={launchingList.current[0]}
                onClose={() => {
                  timeLikeHandler.close()
                }} />,
              closeOnMaskClick: true,
              className: 'no-bg'
            })
          }
        }

      }, 1000);
    }

  }

  async function hate() {
    if (
      launchingList &&
      launchingList.current &&
      launchingList.current.length > 1
    ) {
      if (renderLaunchingIndexRef.current === 0) {
        setActionStyle2(styles.hate);
      } else {
        setActionStyle(styles.hate);
      }

      setTimeout(() => {
        getLaunchingNext();
        setTimeout(() => {
          setActionStyle2(null);
          setActionStyle(null);
          setMovingStyle({})
          setMovingStyle2({})
        }, 100)
      }, 1000);
    }
    onHate()
  }

  async function justNext(type: string) {
    if (
      launchedList &&
      launchedList.current &&
      launchedList.current.length > 1
    ) {
      if (scrollRef.current) {
        return
      }

      scrollRef.current = true
      const style = type === "like" ? styles.like : styles.hate;
      if (renderLaunchedIndexRef.current === 0) {
        setActionStyle2(style);
      } else {
        setActionStyle(style);
      }
      // setActionStyle(style);
      setTimeout(() => {
        getLaunchedNext();
        setTimeout(() => {
          setActionStyle2(null);
          setActionStyle(null);
          setMovingStyle({})
          setMovingStyle2({})
          scrollRef.current = false
        }, 100)
      }, 1000);
    }
  }

  console.log('renderLaunchingIndex:')


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
            {
              infoDataLaunching && (
                <div
                  style={{
                    zIndex: renderLaunchingIndex === 0 ? 1 : 2,
                    ...movingStyle
                  }}
                  key={infoDataLaunching.id}
                  className={[styles.thumbnailBox, actionStyle].join(" ")}
                >
                  <Thumbnail
                    showProgress={true}
                    showDesc={true}
                    data={infoDataLaunching}
                  />
                </div>
              )
            }

            {
              infoDataLaunching2 && (
                <div
                  key={infoDataLaunching2.id}
                  style={{
                    zIndex: renderLaunchingIndex === 0 ? 2 : 1,
                    ...movingStyle2
                  }}
                  className={[styles.thumbnailBox, actionStyle2].join(" ")}
                >
                  <Thumbnail
                    showProgress={true}
                    showDesc={true}
                    data={infoDataLaunching2}
                  />
                </div>
              )
            }
          </div>

          <LaunchingAction
            token={renderLaunchingIndex === 0 ? infoDataLaunching2 : infoDataLaunching}
            onLike={async () => {
              like();
            }}
            onHate={async () => {
              hate();
            }}
            onSuperLike={async () => {
              const token = renderLaunchingIndex === 0 ? infoDataLaunching2 : infoDataLaunching
              const val = await httpAuthGet('/project/?id=' + token?.id)
              if (val.code === 0) {
                const newTokenInfo = mapDataToProject(val.data[0])
                updateLaunchingToken(newTokenInfo)
              }
            }}
            onBoost={async () => {
              const token = renderLaunchingIndex === 0 ? infoDataLaunching2 : infoDataLaunching
              const val = await httpAuthGet('/project/?id=' + token?.id)
              if (val.code === 0) {
                const newTokenInfo = mapDataToProject(val.data[0])
                updateLaunchingToken(newTokenInfo)
              }
            }}
          />
        </>
      )}

      {launchIndex === 1 && (
        <>
          <div className={styles.thumbnailListBox} ref={containerLaunchedRef}>
            {infoDataLaunched && (
              <div
                key={infoDataLaunched.id}
                style={{
                  zIndex: renderLaunchedIndex === 0 ? 1 : 2,
                  ...movingStyle
                }}
                className={[styles.thumbnailBox, actionStyle].join(" ")}
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
                key={infoDataLaunched2.id}
                style={{
                  zIndex: renderLaunchedIndex === 0 ? 2 : 1,
                  ...movingStyle2
                }}
                className={[styles.thumbnailBox, actionStyle2].join(" ")}
              >
                <Thumbnail
                  showProgress={true}
                  showDesc={true}
                  data={infoDataLaunched2}
                />
              </div>
            )}
          </div>

          {(infoDataLaunched2 || infoDataLaunched) && <LaunchedAction data={renderLaunchedIndex === 0 ? infoDataLaunched2 : infoDataLaunched} />}
        </>
      )}
    </div>
  );
}

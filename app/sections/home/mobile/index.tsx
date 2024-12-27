"use client";

import GuidingTour from "@/app/components/guiding-tour";
import { MaskPlacement } from "@/app/components/guiding-tour/get-style-rect";
import styles from "./home.module.css";
import Thumbnail from "@/app/components/thumbnail";
import LaunchingAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import Messages from "@/app/components/messages";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useData from "../hooks/use-data";
import Tabs from "../tabs";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import useSwip from "./hooks/useSwip";
import { httpAuthGet } from "@/app/utils";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { useHomeTab } from "@/app/store/useHomeTab";
import { Modal } from "antd-mobile";
import SeenAll from "@/app/components/timesLike/seenAll";
import { mapDataToProject } from "@/app/utils/mapTo";
import TrendBanner from "@/app/sections/trends/components/banner";
import { useTrends } from "@/app/sections/home/mobile/hooks/useTrends";
import { AnimatePresence, motion } from "framer-motion";
import { useGuidingTour } from "@/app/store/use-guiding-tour";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();
  const params = useSearchParams();
  const { visible: trendsVisible, handleClose: handleTrendsClose } =
    useTrends();
  const { hasShownTour } = useGuidingTour();

  const { homeTabIndex, set: setHomeTabIndex }: any = useHomeTab();

  const [actionStyle, setActionStyle] = useState<any>("");
  const [actionStyle2, setActionStyle2] = useState<any>("");
  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger } =
    useMessage();
  const containerPreLaunchRef = useRef<any>();
  const containerLaunchedRef = useRef<any>();
  const likeTriggerRef = useRef(likeTrigger);
  const hateTriggerRef = useRef(hateTrigger);
  const scrollRef = useRef(false);

  const [movingStyle, setMovingStyle] = useState({});
  const [movingStyle2, setMovingStyle2] = useState({});

  const {
    infoData: infoDataLaunching,
    infoData2: infoDataLaunching2,
    getnext: getLaunchingNext,
    hasNext: hasLaunchingNext,
    list: launchingList,
    renderIndex: renderLaunchingIndex,
    renderIndexRef: renderLaunchingIndexRef,
    updateCurrentToken: updateLaunchingToken,
    isLoading: isLaunchingLoading
  } = useData("preLaunch");

  const {
    infoData: infoDataLaunched,
    infoData2: infoDataLaunched2,
    hasNext: hasLaunchedNext,
    list: launchedList,
    getnext: getLaunchedNext,
    renderIndex: renderLaunchedIndex,
    renderIndexRef: renderLaunchedIndexRef,
    updateCurrentToken: updateLaunchedToken
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

      console.log("preing");
      const style = {
        // opacity: percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${100 * percent}vh)`
      };
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

      console.log("nexting");
      const style = {
        // opacity: percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${
          -100 * percent
        }vh)`
      };
      if (renderLaunchingIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
    },
    homeTabIndex === 0,
    likeTriggerRef.current || likeTriggerRef.current
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

      console.log("preing");
      const style = {
        opacity: 1 - percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${100 * percent}vh)`
      };
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

      console.log("nexting", percent);
      const style = {
        opacity: 1 - percent,
        transform: `rotate(${40 * percent}deg) translate(0, ${
          -100 * percent
        }vh)`
      };
      if (renderLaunchedIndexRef.current === 0) {
        setMovingStyle2(style);
      } else {
        setMovingStyle(style);
      }
    },
    homeTabIndex === 1,
    scrollRef.current
  );

  useEffect(() => {
    hateTriggerRef.current = hateTrigger;
  }, [hateTrigger]);

  useEffect(() => {
    likeTriggerRef.current = likeTrigger;
  }, [likeTrigger]);

  async function like() {
    if (launchingList && launchingList.current) {
      if (launchingList.current.length > 0) {
        const data = launchingList.current[0];

        if (renderLaunchingIndexRef.current === 0) {
          setActionStyle2(styles.like);
        } else {
          setActionStyle(styles.like);
        }

        setTimeout(async () => {
          getLaunchingNext();
          setActionStyle2(null);
          setActionStyle(null);
          setMovingStyle({});
          setMovingStyle2({});
        }, 800);

        const isError = await actionLikeTrigger(data);
      }
    }
  }

  async function hate() {
    if (
      launchingList &&
      launchingList.current &&
      launchingList.current.length > 0
    ) {
      const data = launchingList.current[0];
      if (renderLaunchingIndexRef.current === 0) {
        setActionStyle2(styles.hate);
      } else {
        setActionStyle(styles.hate);
      }

      setTimeout(() => {
        getLaunchingNext();
        setActionStyle2(null);
        setActionStyle(null);
        setMovingStyle({});
        setMovingStyle2({});
      }, 800);

      await actionHateTrigger(data);
    }
  }

  async function justNext(type: string) {
    if (
      launchedList &&
      launchedList.current &&
      launchedList.current.length > 0
    ) {
      if (scrollRef.current) {
        return;
      }

      console.log("justNext");

      scrollRef.current = true;
      const style = type === "like" ? styles.like : styles.hate;

      if (renderLaunchedIndexRef.current === 0) {
        setActionStyle2(style);
      } else {
        setActionStyle(style);
      }

      setTimeout(() => {
        getLaunchedNext();
        setActionStyle2(null);
        setActionStyle(null);
        setMovingStyle({});
        setMovingStyle2({});
        scrollRef.current = false;
      }, 800);
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {trendsVisible && hasShownTour && (
          <motion.div
            style={{ position: "relative", zIndex: 9 }}
            initial={{ y: -200 }}
            exit={{ y: -200 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            <TrendBanner isMobile onClose={handleTrendsClose} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.main}>
        <div className={styles.header}>
          <div
            key="1"
            onClick={() => {
              router.push("/");
            }}
            style={{ width: 27 }}
          >
            <img src="/img/logo.svg" />
          </div>

          <Tabs
            launchIndex={homeTabIndex}
            setLaunchIndex={(launchType: any) => {
              setHomeTabIndex({
                homeTabIndex: launchType
              });
            }}
          />
          <div className={styles.icons}>
            {/* <ConnectButton /> */}
            <Messages />
          </div>
        </div>

        {homeTabIndex === 0 && (
          <>
            <div
              className={styles.thumbnailListBox}
              ref={containerPreLaunchRef}
            >
              {infoDataLaunching && (
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
              )}

              {infoDataLaunching2 && (
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
              )}
            </div>

            <LaunchingAction
              token={
                renderLaunchingIndex === 0
                  ? infoDataLaunching2
                  : infoDataLaunching
              }
              ids={{
                dislike: "guid-home-dislike",
                like: "guid-home-like",
                boost: "guid-home-boost",
                smoke: "guid-home-smoke"
              }}
              onLike={async () => {
                await like();
                const token =
                  renderLaunchingIndex === 0
                    ? infoDataLaunching2
                    : infoDataLaunching;
                const val = await httpAuthGet("/project/?id=" + token?.id);
                if (val.code === 0) {
                  const newTokenInfo = mapDataToProject(val.data[0]);
                  updateLaunchingToken(newTokenInfo);
                }
              }}
              onHate={async () => {
                await hate();
              }}
              onSuperLike={async () => {
                const token =
                  renderLaunchingIndex === 0
                    ? infoDataLaunching2
                    : infoDataLaunching;
                const val = await httpAuthGet("/project/?id=" + token?.id);
                if (val.code === 0) {
                  const newTokenInfo = mapDataToProject(val.data[0]);
                  updateLaunchingToken(newTokenInfo);
                }
              }}
              onBoost={async () => {
                const token =
                  renderLaunchingIndex === 0
                    ? infoDataLaunching2
                    : infoDataLaunching;
                const val = await httpAuthGet("/project/?id=" + token?.id);
                if (val.code === 0) {
                  const newTokenInfo = mapDataToProject(val.data[0]);
                  updateLaunchingToken(newTokenInfo);
                }
              }}
            />
          </>
        )}

        <SeenAll
          show={
            !isLaunchingLoading &&
            homeTabIndex === 0 &&
            !infoDataLaunching &&
            !infoDataLaunching2
          }
          onClose={() => {}}
        />

        {homeTabIndex === 1 && (
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

            {(!!infoDataLaunched2 || !!infoDataLaunched) && (
              <LaunchedAction
                data={
                  renderLaunchedIndex === 0
                    ? infoDataLaunched2
                    : infoDataLaunched
                }
              />
            )}
          </>
        )}
      </div>
      <GuidingTour
        steps={[
          {
            selector: () => {
              return document.getElementById("guid-home-dislike");
            },
            content: (
              <>
                Clicking{" "}
                <span style={{ fontWeight: "bold" }}>{'"Unlike"'}</span>{" "}
                {
                  "means you don't think much of the project and won't push it for you next time."
                }
              </>
            ),
            placement: MaskPlacement.Top
          },
          {
            selector: () => {
              return document.getElementById("guid-home-like");
            },
            content: (
              <>
                Swipe through new projects and{" "}
                <span style={{ fontWeight: "bold" }}>“like”</span> the ones you
                believe in.
              </>
            ),
            placement: MaskPlacement.Top
          },
          {
            selector: () => {
              return document.getElementById("guid-home-smoke");
            },
            content: (
              <>
                With <span style={{ fontWeight: "bold" }}>Pre-Launch</span>{" "}
                tokens, you can{" "}
                <span style={{ fontWeight: "bold" }}>Pre-Buy</span> first to get
                a better price.
              </>
            ),
            placement: MaskPlacement.Top
          },
          {
            selector: () => {
              return document.getElementById("guid-home-trends");
            },
            content: (
              <>
                Here are the <span style={{ fontWeight: "bold" }}>hottest</span>{" "}
                tokens, all can be traded.
              </>
            ),
            placement: MaskPlacement.Top
          },
          {
            selector: () => {
              return document.getElementById("guid-home-create-mobile");
            },
            content: (
              <>
                Set up your{" "}
                <span style={{ fontWeight: "bold" }}>Token project</span> on
                FlipN and promote it to achieve bonding curve graduation.
              </>
            ),
            placement: MaskPlacement.Top
          },
          {
            selector: () => {
              return document.getElementById("guid-home-mining-mobile");
            },
            content: (
              <>
                <span style={{ fontWeight: "bold" }}>Like</span>
                {"the projects you love, participate in SexyFi's points"}{" "}
                <span style={{ fontWeight: "bold" }}>mining</span> campaign.
              </>
            ),
            placement: MaskPlacement.Top
          }
        ]}
      />
    </>
  );
}

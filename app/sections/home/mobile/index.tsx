"use client";

import ConnectButton from "@/app/components/connectButton";
import styles from "./home.module.css";
import Thumbnail from "@/app/components/thumbnail";
import LaunchingAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Hammer from "hammerjs";
import useData from "../hooks/use-data";
import Tabs from "../tabs";
import { useMessage } from "@/app/context/messageContext";
import { useAccount } from "@/app/hooks/useAccount";
import useSwip from "./hooks/useSwip";

export default function Home() {
  const router = useRouter();
  const { address } = useAccount()
  const params = useSearchParams()
  const [launchIndex, setLaunchIndex] = useState(0);
  const [actionStyle, setActionStyle] = useState<any>("");
  const { likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger } = useMessage();
  const containerPreLaunchRef = useRef<any>();
  const containerLaunchedRef = useRef<any>();

  const {
    infoData: infoDataLaunching,
    infoData2: infoDataLaunching2,
    getnext: getLaunchingNext,
    onLike,
    onHate
  } = useData('preLaunch');

  const {
    infoData: infoDataLaunched,
    infoData2: infoDataLaunched2,
    getnext: getLaunchedNext,
  } = useData('launching');

  useSwip(containerPreLaunchRef, () => {
    if (hateTrigger) {
      return
    }

    setHateTrigger(true)
    hate()

    setTimeout(() => {
      setHateTrigger(false);
    }, 1600);
  }, () => {
    if (likeTrigger) {
      return;
    }
    setLikeTrigger(true);
    like();

    setTimeout(() => {
      setLikeTrigger(false);
    }, 1600);
  }, launchIndex === 0)

  useSwip(containerLaunchedRef, () => {
    justNext('hate')
  }, () => {
    justNext('like')
  }, launchIndex === 1)

  useEffect(() => {
    if (params) {
      const launchType = params.get('launchType')
      if (launchType === '0') {
        setLaunchIndex(0)
      } else if (launchType === '1') {
        setLaunchIndex(1)
      }
    } else {
      setLaunchIndex(0)
    }
  }, [params])

  async function like() {
    setActionStyle(styles.like);

    setTimeout(() => {
      setActionStyle(null);
      getLaunchingNext();
    }, 1000);
    onLike();
  }

  async function hate() {
    setActionStyle(styles.hate);
    setTimeout(() => {
      setActionStyle(null);
      getLaunchingNext();
    }, 1000);
    onHate();
  }

  async function justNext(type: string) {
    const style = type === 'like' ? styles.like : styles.hate
    setActionStyle(style);
    setTimeout(() => {
      setActionStyle(null);
      getLaunchedNext();
    }, 1000);
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

        <Tabs launchIndex={launchIndex} setLaunchIndex={(launchType: any) => {
          router.push('/?launchType=' + launchType)
        }} />
        <div className={styles.icons}>
          {/* <ConnectButton /> */}
          <div className={styles.notice}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="17" cy="17" r="17" fill="black" fill-opacity="0.2" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9722 6C14.0602 6 10.8889 9.17131 10.8889 13.0833V21.1111C10.8889 21.1111 10.8889 21.7014 10.4167 22.5278C10.0285 23.2071 9 23.9444 9 23.9444H26.9444C26.9444 23.9444 25.8777 23.2276 25.5278 22.5278C25.0556 21.5833 25.0556 21.1111 25.0556 21.1111V13.0833C25.0556 9.17131 21.8842 6 17.9722 6ZM17.9722 28.6667C19.7978 28.6667 21.2778 27.1867 21.2778 25.3611H14.6667C14.6667 27.1867 16.1466 28.6667 17.9722 28.6667Z" fill="url(#paint0_linear_17_841)" />

              {
                address ? <circle cx="26.6667" cy="6.66667" r="4.66667" fill="#FF2BA0" stroke="white" stroke-width="2" /> : null
              }
              <defs>
                <linearGradient id="paint0_linear_17_841" x1="17.9722" y1="6" x2="17.9722" y2="28.6667" gradientUnits="userSpaceOnUse">
                  <stop stop-color="white" stop-opacity="0.6" />
                  <stop offset="1" stop-color="white" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {
        launchIndex === 0 && <><div className={styles.thumbnailListBox} ref={containerPreLaunchRef}>
          {infoDataLaunched && (
            <div style={{ zIndex: 1 }} className={[styles.thumbnailBox].join(" ")}>
              <Thumbnail showProgress={true} showDesc={true} data={infoDataLaunched} />
            </div>
          )}

          {infoDataLaunching2 && (
            <div style={{ zIndex: 2 }} className={[styles.thumbnailBox, actionStyle].join(" ")}>
              <Thumbnail showProgress={true} showDesc={true} data={infoDataLaunching2} />
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
            onSuperLike={() => { }}
            onBoost={() => { }}
          /></>
      }

      {
        launchIndex === 1 && <><div className={styles.thumbnailListBox} ref={containerLaunchedRef}>
          {infoDataLaunching && (
            <div style={{ zIndex: 1 }} className={[styles.thumbnailBox].join(" ")}>
              <Thumbnail showProgress={true} showDesc={true} data={infoDataLaunching} />
            </div>
          )}

          {infoDataLaunched2 && (
            <div style={{ zIndex: 2 }} className={[styles.thumbnailBox, actionStyle].join(" ")}>
              <Thumbnail showProgress={true} showDesc={true} data={infoDataLaunched2} />
            </div>
          )}
        </div>

          {
            infoDataLaunched2 && <LaunchedAction
              data={infoDataLaunched2}
            />
          }
        </>
      }

    </div>
  );
}

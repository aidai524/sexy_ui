"use client";
import Info from "./components/info/detail";
import Chart from "./components/chart/index";
import Txs from "./components/txs/index";
import styles from "./detail.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Tab from "@/app/components/tab";
import SexPullToRefresh from "@/app/components/sexPullToRefresh";
import CircleLoading from "@/app/components/icons/loading";
import useTokenDetail from "./use-token-detail";
import AvatarDetail from "@/app/components/avatarDetail";
import Back from "@/app/components/backNew";
import CommnentList from "./components/comment/commnet";
import PreLaunchAction from "@/app/components/action/launching";
import LaunchedAction from "@/app/components/action/launched";
import { useUserAgent } from "@/app/context/user-agent";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import { useMessage } from "@/app/context/messageContext";
import { useDebounceFn } from "ahooks";
import { useProjects } from "@/app/store/use-projects";

export default function Detail({ token, onBack, onSuccess, onUpdate }: any) {
  const [activeKey, setActiveKey] = useState("Info");
  const {
    infoData: queryedInfoData,
    isLoading,
    getDetailInfo
  } = useTokenDetail({ token });
  const projectsStore = useProjects();
  const { isMobile, innerHeight, innerWidth } = useUserAgent();
  const { showShare } = useMessage()
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(60);

  const infoData = useMemo(
    () => queryedInfoData || token,
    [queryedInfoData, token]
  );

  const { run } = useDebounceFn(() => {
    setHeaderHeight(headerRef.current?.clientHeight || 60)
  }, { wait: 500 })

  const mc = useMcWithPump(infoData);

  useEffect(() => {
    if (infoData) {
      run();
    }
  }, [infoData]);

  useEffect(() => {
    if (infoData) {
      projectsStore.updateProject(infoData.status === 0 ? 'preLaunch' : 'launching', infoData); 
    }
  }, [infoData]);

  useEffect(() => {
    onBack &&
      token &&
      history.pushState(
        { page: "/detail" },
        "Detail",
        `/detail?address=${token.address}`
      );
  }, [onBack, token]);

  if (isLoading) {
    return (
      <div className={styles.loadingBox}>
        <CircleLoading size={60} />
      </div>
    );
  }

  return (
    <div>
      <SexPullToRefresh
        onRefresh={async () => {
          await getDetailInfo();
        }}
      >
        <div className={styles.main}>
          <div className={styles.Content}>
            <div className={styles.header} ref={headerRef}>
              <div className={styles.backWrapper}>
                <div style={{ marginTop: 8 }}>
                  <Back onBack={onBack} />
                </div>
                <AvatarDetail token={infoData} mc={mc} />
              </div>
            </div>

            <div
              style={{
                height: innerHeight - headerHeight,
                overflow: "auto",
                paddingBottom: 100
              }}
            >
              {infoData?.status === 0 && (
                <div className={styles.commentWrapper}>
                  <Info
                    mc={mc}
                    data={infoData}
                    showHodler={false}
                    onUpdate={() => {
                      getDetailInfo();
                    }}
                  />
                  <CommnentList
                    style={{
                      backgroundColor: "#121719",
                      borderRadius: "10px",
                      margin: "3px"
                    }}
                    token={infoData}
                    onSuccess={() => {
                      getDetailInfo();
                    }}
                  />
                </div>
              )}

              {infoData?.status !== 0 && (
                <Chart token={infoData} style={{ position: "relative" }} />
              )}

              {infoData?.status !== 0 && (
                <Tab
                  activeNode={activeKey}
                  onTabChange={(nodeName) => {
                    setActiveKey(nodeName);
                  }}
                  nodes={[
                    {
                      name: "Info",
                      content: (
                        <Info
                          mc={mc}
                          data={infoData}
                          onUpdate={() => {
                            getDetailInfo();
                          }}
                        />
                      )
                    },
                    {
                      name: "Comments",
                      content: (
                        <CommnentList
                          token={infoData}
                          onSuccess={() => {
                            getDetailInfo();
                          }}
                        />
                      )
                    },
                    {
                      name: "Trade",
                      content: <Txs mc={mc} data={infoData} />
                    }
                  ]}
                />
              )}
            </div>

            <div className={styles.action}>
              {infoData?.status === 0 && (
                <PreLaunchAction
                  token={infoData}
                  canFlip={false}
                  onLike={async () => {
                    const res = await actionLikeTrigger(infoData, showShare);
                    if (res) {
                      getDetailInfo();
                      onSuccess?.({
                        isLike: true,
                        like: token.like + 1
                      });
                    }
                  }}
                  onHate={async () => {
                    await actionHateTrigger(infoData);
                    getDetailInfo();
                  }}
                  onSuperLike={(amount: any) => {
                    getDetailInfo();
                    onSuccess?.({
                      isSuperLike: true,
                      prePaid: token.prePaid + 1,
                      total_amount: amount
                    });
                  }}
                  onBoost={() => {
                    getDetailInfo();
                  }}
                />
              )}

              {(infoData?.status === 1 || infoData?.status === 3) && (
                <LaunchedAction data={infoData} />
              )}
            </div>
          </div>
        </div>
      </SexPullToRefresh>
    </div>
  );
}

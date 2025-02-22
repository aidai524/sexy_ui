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
import { useAuth } from "@/app/context/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { TokenStatusModal } from "@/app/components/status2Alert";
import Share from "@/app/components/share";
import TokenIcon from "@/app/components/avatar/token";
import Desc from "./components/desc";

export default function Detail({ token, onBack, onSuccess }: any) {
  const [activeKey, setActiveKey] = useState("Info");
  const {
    infoData: queryedInfoData,
    isLoading,
    getDetailInfo
  } = useTokenDetail({ token });
  const { updateUserLikeNum } = useAuth();
  const { isMobile, innerHeight, innerWidth } = useUserAgent();
  const router = useRouter();
  const search = useSearchParams();
  const { showShare } = useMessage();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(60);

  const infoData = useMemo(
    () => queryedInfoData || token,
    [queryedInfoData, token]
  );

  const { run } = useDebounceFn(
    () => {
      setHeaderHeight(headerRef.current?.clientHeight || 60);
    },
    { wait: 500 }
  );

  const mc = useMcWithPump(infoData);

  useEffect(() => {
    if (infoData) {
      run();
    }
  }, [infoData]);

  useEffect(() => {
    if (onBack && token) {
      history.pushState(
        { page: "/detail" },
        "Detail",
        `/detail?address=${token.address}`
      );
    }
  }, [onBack, token]);

  const tabs = useMemo(() => {
    const vals = [
      { name: "Details", content: <Desc data={infoData} mc={mc} /> },
      {
        name: "Comments",
        content: (
          <CommnentList
            token={infoData}
            onSuccess={() => {
              onSuccess?.({
                comment: token.comment + 1
              });
            }}
          />
        )
      }
    ];

    if (infoData?.status > 0) {
      vals.push({ name: "Trades", content: <Txs mc={mc} data={infoData} /> });
    }

    return vals;
  }, [infoData, mc]);

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
                <Back
                  onBack={() => {
                    if (onBack) {
                      onBack();
                      return;
                    }
                    if (
                      ["profile", "trends", "messages"].includes(
                        search.get("from") || ""
                      )
                    ) {
                      router.back();
                      return;
                    }
                    router.push("/");
                  }}
                />
                <AvatarDetail token={infoData} />

                <Share token={infoData} />
              </div>
            </div>

            <div
              style={{
                height: innerHeight - headerHeight,
                overflow: "auto",
                paddingBottom: 100,
                WebkitOverflowScrolling: "touch"
              }}
            >
              <div className={styles.commentWrapper}>
                <Info
                  mc={mc}
                  data={infoData}
                  showHodler={false}
                  onUpdate={() => {
                    getDetailInfo();
                  }}
                />
              </div>

              {infoData?.status !== 0 && (
                <Chart token={infoData} style={{ position: "relative" }} />
              )}

              <Tab
                activeNode={activeKey}
                onTabChange={(nodeName) => {
                  setActiveKey(nodeName);
                }}
                nodes={tabs}
              />
            </div>

            <div className={styles.action}>
              {infoData?.status === 0 && (
                <PreLaunchAction
                  token={infoData}
                  canFlip={false}
                  onLike={async () => {
                    const res = await actionLikeTrigger({
                      data: infoData,
                      onShare: showShare,
                      onSuccess: updateUserLikeNum
                    });
                    if (res) {
                      onSuccess?.({
                        isLike: true,
                        is_like: true,
                        like: token.like + 1
                      });
                      getDetailInfo();
                    }
                  }}
                  onHate={async () => {
                    await actionHateTrigger(infoData);
                    getDetailInfo();
                  }}
                  onSuperLike={(amount: any) => {
                    onSuccess?.({
                      isSuperLike: true,
                      prePaid: token.prePaid + 1,
                      total_amount: amount
                    });
                    getDetailInfo();
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

      <TokenStatusModal
        status={infoData?.status}
        onClose={() => {
          getDetailInfo();
        }}
      />
    </div>
  );
}

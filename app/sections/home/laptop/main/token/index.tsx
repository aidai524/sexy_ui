import ActionsBar from "../actions-bar";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import Header from "./header";
import TokenCard from "../token-card";
import InfoPart from "@/app/sections/detail/components/info/infoPart";
import Txs from "@/app/sections/detail/components/txs";
import CommentComp from "@/app/components/comment";
import PanelWrapper from "../../panels/trade/panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Empty from "@/app/components/empty/prelaunch";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { useState, useMemo, useEffect } from "react";
import Loading from "@/app/components/icons/loading";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useAuth } from "@/app/context/auth";
import useMc from "@/app/hooks/useMc";
import { useRouter } from "next/navigation";
import useCommentList from "@/app/hooks/use-comment-list";
import { useMessage } from "@/app/context/messageContext";

export default function Token({
  infoData2,
  getnext,
  onOpenFull,
  type,
  from,
  isLoading,
  isFull,
  list
}: any) {
  const [currentTab, setCurrentTab] = useState("info");
  const { userInfo } = useAuth();
  const [mc, setMC] = useState<string | number>("-");
  const router = useRouter();
  const comments = useCommentList({ id: infoData2?.id });
  const { showShare } = useMessage();
  const { mc: pumpMc } = useMc({
    tokenAddress: infoData2?.address,
    disable: infoData2?.status < 1
  });

  const { getMC, pool } = useTokenTrade({
    tokenName: infoData2?.tokenName as string,
    tokenSymbol: infoData2?.tokenSymbol as string,
    tokenDecimals: infoData2?.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    if (
      pool &&
      pool.length > 0 &&
      infoData2?.DApp === "sexy" &&
      infoData2?.status === 1
    ) {
      getMC().then((res) => {
        setMC(res as number);
      });
    } else {
      setMC(0);
    }
  }, [pool, infoData2]);

  useEffect(() => {
    setCurrentTab("info");
  }, [type]);

  const next = () => {
    if (from === "detail") return;
    getnext();
  };

  const like = async () => {
    next();
    await actionLikeTrigger(infoData2, showShare);
  };

  const hate = () => {
    if (!userInfo?.address) {
      // @ts-ignore
      window.connect();
      return;
    }
    next();
    actionHateTrigger(infoData2);
  };

  const isListEmpty = useMemo(() => !list?.length, [list?.length]);

  return (
    <div>
      <div className={styles.Container}>
        <div className={styles.Flip} />
        <Header
          tokenInfo={infoData2}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenFull={onOpenFull}
          type={type}
          from={from}
        />

        <div className={styles.Wrapper}>
          {/*  */}
          {infoData2 && (!isListEmpty || from === "detail") && !isLoading && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {
                  opacity: 0
                },
                show: {
                  opacity: 1,

                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
              className={styles.Content}
            >
              <TokenCard token={infoData2} {...comments} />
              {currentTab === "info" && (
                <PanelWrapper
                  style={{
                    backgroundColor: "#ab1f5c",
                    marginRight: 15
                  }}
                >
                  <InfoPart
                    showLikes={false}
                    data={infoData2}
                    showProgress={false}
                    theme="light"
                    mc={pumpMc || mc}
                  />
                  <div style={{ height: 2 }} />
                  <CommentComp id={infoData2.id} theme="light" {...comments} />
                </PanelWrapper>
              )}
              {currentTab === "chart" && (
                <PanelWrapper>
                  <Chart
                    token={infoData2}
                    style={{
                      padding: "10px",
                      marginRight: "10px",
                      borderRadius: "10px",
                      backgroundColor: "#121719",
                      height: "calc(100vh - 310px)"
                    }}
                  />
                </PanelWrapper>
              )}
              {currentTab === "txs" && (
                <PanelWrapper>
                  <Txs from="laptop-home" data={infoData2} mc={pumpMc || mc} />
                </PanelWrapper>
              )}
            </motion.div>
          )}
          {/*  */}
          {isLoading && (
            <div className={styles.EmptyWrapper}>
              <Loading size={40} />
            </div>
          )}
          {/*  */}
          {isListEmpty && from !== "detail" && (
            <Empty
              type={type === 0 ? "preLaunch" : "launching"}
              from={from}
              onTextClick={() => {
                router.push(`/?launchType=${type === 0 ? 1 : 0}`);
              }}
            />
          )}
        </div>
      </div>
      <ActionsBar
        tokenInfo={infoData2}
        onLike={like}
        onHate={hate}
        onSuperLike={() => {
          next();
        }}
        onBoost={next}
      />
    </div>
  );
}

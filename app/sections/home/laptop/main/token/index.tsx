import ActionsBar from "../actions-bar";
import styles from "./index.module.css";
import { motion } from "framer-motion";
import Header from "./header";
import TokenCard from "../token-card";
import InfoPart from "@/app/sections/detail/components/info/infoPart";
import Txs from "@/app/sections/detail/components/txs";
import CommentComp from "@/app/components/comment";
import PanelWrapper from "./panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Empty from "@/app/components/empty/prelaunch";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { useState, useMemo, useEffect } from "react";
import { useLaptop } from "@/app/context/laptop";
import Loading from "@/app/components/icons/loading";
import NextButton from "../../fullscreen/next-button";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { useAuth } from "@/app/context/auth";

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
  const { updateInfo } = useLaptop();
  const { userInfo } = useAuth();
  const [mc, setMC] = useState<string | number>("-");

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
        console.log("mc:", mc);

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
    await actionLikeTrigger(infoData2);
    updateInfo("liked");
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

  const isListEmpty = useMemo(() => !list?.length, [list]);

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
          {infoData2 ? (
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
              <TokenCard token={infoData2} />
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
                    showThumbnailHead={false}
                    showTop={false}
                    theme="light"
                    sepSize={2}
                    mc={mc}
                  />
                  <div style={{ height: 2 }} />
                  <CommentComp id={infoData2.id} theme="light" />
                </PanelWrapper>
              )}
              {currentTab === "chart" && (
                <PanelWrapper>
                  <Chart
                    data={infoData2}
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
                  <Txs from="laptop-home" data={infoData2} mc={mc} />
                </PanelWrapper>
              )}
            </motion.div>
          ) : isLoading ? (
            <div className={styles.EmptyWrapper}>
              <Loading size={40} />
            </div>
          ) : (
            isListEmpty && (
              <Empty
                type={type === 0 ? "preLaunch" : "launching"}
                from={from}
              />
            )
          )}
        </div>
      </div>
      <ActionsBar
        tokenInfo={infoData2}
        onLike={like}
        onHate={hate}
        onSuperLike={() => {
          next();
          updateInfo("flip");
        }}
        onBoost={next}
      />

      {!isFull && infoData2 && from !== "detail" && type && (
        <NextButton
          onClick={() => {
            if (type === 0) {
              hate();
            } else {
              if (!userInfo?.address) {
                // @ts-ignore
                window.connect();
                return;
              }
              next();
            }
          }}
        />
      )}
    </div>
  );
}

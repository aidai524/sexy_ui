import ActionsBar from "../actions-bar";
import styles from "./index.module.css";
import Header from "./header";
import TokenCard from "../token-card";
import InfoPart from "@/app/sections/detail/components/info/infoPart";
import BuyAndSell from "@/app/sections/detail/components/trade";
import Txs from "@/app/sections/detail/components/txs";
import CommentComp from "@/app/components/comment";
import PanelWrapper from "./panel-wrapper";
import Chart from "@/app/sections/detail/components/chart";
import Empty from "@/app/components/empty/prelaunch";
import {
  actionHateTrigger,
  actionLikeTrigger
} from "@/app/components/timesLike/ActionTrigger";
import { useState } from "react";
import Loading from "@/app/components/icons/loading";

export default function Token({
  infoData2,
  getnext,
  onOpenFull,
  type,
  from,
  isLoading
}: any) {
  const [currentTab, setCurrentTab] = useState("info");

  const next = () => {
    if (from === "detail") return;
    setTimeout(() => {
      getnext();
    }, 1000);
  };

  const like = () => {
    next();
    actionLikeTrigger(infoData2);
  };

  const hate = () => {
    next();
    actionHateTrigger(infoData2);
  };

  return (
    <>
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

        <div className={styles.Content}>
          {infoData2 ? (
            <>
              <TokenCard token={infoData2} />
              {currentTab === "info" && (
                <PanelWrapper>
                  <InfoPart
                    showLikes={false}
                    data={infoData2}
                    showThumbnailHead={false}
                    showTop={false}
                    theme="light"
                    sepSize={2}
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
              {currentTab === "buy/sell" && (
                <PanelWrapper>
                  <BuyAndSell mc="-" data={infoData2} from="laptop" />
                </PanelWrapper>
              )}
              {currentTab === "txs" && (
                <PanelWrapper>
                  <Txs from="laptop" />
                </PanelWrapper>
              )}
            </>
          ) : isLoading ? (
            <div className={styles.EmptyWrapper}>
              <Loading size={40} />
            </div>
          ) : (
            <Empty type={type === 0 ? "preLaunch" : "launching"} />
          )}
        </div>
      </div>
      <ActionsBar
        tokenInfo={infoData2}
        onLike={like}
        onHate={hate}
        onSuperLike={next}
        onBoost={next}
      />
    </>
  );
}

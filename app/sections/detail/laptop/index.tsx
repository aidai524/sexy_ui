import { motion } from "framer-motion";
import styles from "./index.module.css";
import Token from "../../home/laptop/token";
import useTokenDetail from "../use-token-detail";
import { useEffect, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const DetailPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/detail")
);

const CommentsPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/comments")
);

const FlipPanel = dynamic(
  () => import("@/app/sections/home/laptop/panels/flip")
);

export default function Laptop(props: any) {
  const { infoData, isLoading } = useTokenDetail({});
  const [currentToken, setCurrentToken] = useState(infoData);
  const [showDetail, setShowDetail] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showFlip, setShowFlip] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [tradeTab, setTradeTab] = useState("chart");
  const { innerHeight, innerWidth } = useUserAgent();

  useEffect(() => {
    setCurrentToken(infoData);
  }, [infoData]);

  return (
    <motion.div
      className={styles.Wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.TitleWrapper}>Detail</div>
      <div className={styles.Content}>
        <div
          style={{
            transform: `translateX(${
              showDetail || showComments || showFlip || showTrade
                ? "calc(50vw - 600px)"
                : "calc(50vw - 300px)"
            })`,
            width: innerWidth
          }}
        >
          <Token
            token={currentToken}
            isCurrent={true}
            onUpdate={(token: any) => {
              setCurrentToken(JSON.parse(JSON.stringify(token)));
            }}
            opacity={1}
            showTrade={showTrade}
            tradeTab={tradeTab}
            onUpdateTradeTab={setTradeTab}
            onOpenPanel={(type: string) => {
              if (type === "showDetail") {
                setShowDetail(!showDetail);
                return;
              }
              if (type === "showComments") {
                setShowComments(!showComments);
                return;
              }
              if (type === "showFlip") {
                setShowFlip(!showFlip);
                return;
              }
              if (type === "showTrade") {
                setShowTrade(!showTrade);
                return;
              }
            }}
          />
        </div>
        {currentToken && (
          <AnimatePresence mode="wait">
            {showDetail && (
              <DetailPanel
                token={currentToken}
                onClose={() => {
                  setShowDetail(false);
                }}
              />
            )}
            {showComments && (
              <CommentsPanel
                token={currentToken}
                onClose={() => {
                  setShowComments(false);
                }}
                onSuccess={() => {
                  currentToken.comment = currentToken.comment + 1;
                  setCurrentToken(JSON.parse(JSON.stringify(currentToken)));
                }}
              />
            )}
            {showFlip && (
              <FlipPanel
                token={currentToken}
                onClose={() => {
                  setShowFlip(false);
                }}
                onSuccess={(amount: string) => {
                  currentToken.isSuperLike = true;
                  currentToken.prePaid = currentToken.prePaid + 1;
                  currentToken.total_amount = amount;
                  setCurrentToken(JSON.parse(JSON.stringify(currentToken)));
                  setShowFlip(false);
                }}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import styles from "./index.module.css";
import Token from "../../home/laptop/token";
import useTokenDetail from "../use-token-detail";
import { useEffect, useState } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import GoBack from "@/app/components/back/laptop";
import { TokenStatusModal } from "@/app/components/status2Alert";
import { useDetailStatus } from "@/app/store/use-detail-status";

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
  const { infoData, isLoading, getDetailInfo } = useTokenDetail({});
  const detailStatusStore: any = useDetailStatus();
  const { innerWidth } = useUserAgent();
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    detailStatusStore.setToken(infoData);
  }, [infoData]);

  return (
    <motion.div
      className={styles.Wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.TitleWrapper}>
        {["profile", "trends", "messages"].includes(
          search.get("from") || ""
        ) && <GoBack text="" />}
        Detail
      </div>
      <div className={styles.Content}>
        <div
          style={{
            transform: `translateX(${
              detailStatusStore.hasShow()
                ? "calc(50vw - 600px)"
                : "calc(50vw - 300px)"
            })`,
            width: innerWidth
          }}
        >
          <Token
            token={detailStatusStore.token}
            isCurrent={true}
            onUpdate={(token: any) => {
              detailStatusStore.setToken(JSON.parse(JSON.stringify(token)));
            }}
            opacity={1}
            showTrade={detailStatusStore.showTrade}
            tradeTab={detailStatusStore.tab}
            onUpdateTradeTab={detailStatusStore.setTab}
            onOpenPanel={(type: string) => {
              if (type === "showDetail") {
                detailStatusStore.setShow(
                  "showDetail",
                  !detailStatusStore.showDetail
                );
                const { origin, pathname, search } = location;
                const _search = new URLSearchParams(search);

                router.replace(
                  new URL(
                    origin + pathname + "?" + _search.toString()
                  ).toString()
                );
                return;
              }
              if (type === "showComments") {
                detailStatusStore.setShow(
                  "showComments",
                  !detailStatusStore.showComments
                );
                return;
              }
              if (type === "showFlip") {
                detailStatusStore.setShow(
                  "showFlip",
                  !detailStatusStore.showFlip
                );
                return;
              }
              if (type === "showTrade") {
                detailStatusStore.setShow(
                  "showTrade",
                  !detailStatusStore.showTrade
                );
                return;
              }
            }}
          />
        </div>
        {detailStatusStore.token && (
          <AnimatePresence mode="wait">
            {detailStatusStore.showDetail && (
              <DetailPanel
                token={detailStatusStore.token}
                onClose={() => {
                  detailStatusStore.setShow("showDetail", false);
                  const { origin, pathname, search } = location;
                  const _search = new URLSearchParams(search);
                  _search.delete("details");
                  router.replace(
                    new URL(
                      origin + pathname + "?" + _search.toString()
                    ).toString()
                  );
                }}
              />
            )}
            {detailStatusStore.showComments && (
              <CommentsPanel
                token={detailStatusStore.token}
                onClose={() => {
                  detailStatusStore.setShow("showComments", false);
                }}
                onSuccess={() => {
                  detailStatusStore.token.comment =
                    detailStatusStore.token.comment + 1;
                  detailStatusStore.setToken(
                    JSON.parse(JSON.stringify(detailStatusStore.token))
                  );
                }}
              />
            )}
            {detailStatusStore.showFlip && (
              <FlipPanel
                token={detailStatusStore.token}
                onClose={() => {
                  detailStatusStore.setShow("showFlip", false);
                }}
                onSuccess={(amount: string) => {
                  detailStatusStore.token.isSuperLike = true;
                  detailStatusStore.token.prePaid =
                    detailStatusStore.token.prePaid + 1;
                  detailStatusStore.token.total_amount = amount;
                  detailStatusStore.setToken(
                    JSON.parse(JSON.stringify(detailStatusStore.token))
                  );
                  detailStatusStore.setShow("showFlip", false);
                }}
              />
            )}
          </AnimatePresence>
        )}
      </div>

      <TokenStatusModal
        status={infoData?.status}
        onClose={() => {
          getDetailInfo();
        }}
      />
    </motion.div>
  );
}

import { motion } from "framer-motion";
import styles from "./index.module.css";
import Token from "../../home/laptop/token";
import useTokenDetail from "../use-token-detail";
import { useEffect } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { useSearchParams } from "next/navigation";
import BackIcon from "./back-icon";
import { TokenStatusModal } from "@/app/components/status2Alert";
import { useDetailStatus } from "@/app/store/use-detail-status";

export default function Laptop(props: any) {
  const { infoData, getDetailInfo } = useTokenDetail({});
  const detailStatusStore: any = useDetailStatus();
  const { innerWidth } = useUserAgent();
  const search = useSearchParams();

  const searchFrom = search.get("from") || "";

  useEffect(() => {
    detailStatusStore.setToken(infoData);
  }, [infoData]);

  useEffect(() => {
    if (searchFrom === "memes") {
      detailStatusStore.setShow("showTrade", true);
    }
  }, [searchFrom]);

  return (
    <motion.div
      className={styles.Wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
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
          <div className={styles.BackButton}>
            {["profile", "memes", "messages"].includes(
              search.get("from") || ""
            ) && (
              <BackIcon
                onClick={() => {
                  history.back();
                }}
              />
            )}
          </div>
          <Token
            token={detailStatusStore.token}
            isCurrent={true}
            onUpdate={(token: any, action: string) => {
              if (action && ["launched_like", "comments"].includes(action)) {
                detailStatusStore.setToken(JSON.parse(JSON.stringify(token)));
                return;
              }
              if (action === "flip") {
                setTimeout(() => {
                  getDetailInfo();
                }, 4000);
                return;
              }
              getDetailInfo();
            }}
            opacity={1}
            showTrade={detailStatusStore.showTrade}
            tradeTab={detailStatusStore.tab}
            dataAvailable={true}
            onUpdateTradeTab={detailStatusStore.setTab}
            onOpenPanel={(panleType: string) => {
              detailStatusStore.setShow(
                panleType,
                !detailStatusStore[panleType]
              );
            }}
          />
        </div>
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

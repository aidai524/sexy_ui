import { motion } from "framer-motion";
import styles from "./index.module.css";
import RankLoading from "./rank-loading";
import Panel from "@/app/sections/mining/component/panel";
import InviteCodes from "../component/invite-codes";
import TotalPanel from "../mobile/total-panel";
import InviteFrenz from "../mobile/panels/invite-frenz";
import LikeToEarn from "../mobile/panels/like-to-earn";
import FollowX from "../mobile/panels/follow-x";
import CreateToEarn from "../mobile/panels/create-to-earn";
import Rank from "../component/rank";
import { useConfig } from "@/app/store/useConfig";
import { useState } from "react";

export default function Laptop({
  info,
  infoLoading,
  userInfo,
  rate,
  rateLoading,
  onCopyAll = () => {}
}: any) {
  const configStore: any = useConfig();
  const [showInviteCodes, setShowInviteCodes] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.Container}
      >
        <div className={styles.Left}>
          <Panel isTape className={styles.TotalPanel}>
            <TotalPanel info={info} userInfo={userInfo} />
          </Panel>
          <Panel isTape={false} className={styles.PanelWrapper}>
            <div className={styles.PanelTitle}>Earn</div>
            <div className={styles.Panels}>
              <InviteFrenz
                onOpenInviteCodes={() => {
                  setShowInviteCodes(true);
                }}
                onCopyAll={onCopyAll}
                rate={rate}
              />
              <LikeToEarn info={info} userInfo={userInfo} />
              <FollowX />
              <CreateToEarn airdropEndTime={configStore.AirdropEndTime} />
            </div>
          </Panel>
        </div>
        <div className={styles.Right}>
          {infoLoading ? (
            <RankLoading />
          ) : (
            <Rank loading={infoLoading} info={info} userInfo={userInfo} />
          )}
        </div>
      </motion.div>
      <InviteCodes
        show={showInviteCodes}
        onClose={() => {
          setShowInviteCodes(false);
        }}
      />
    </>
  );
}

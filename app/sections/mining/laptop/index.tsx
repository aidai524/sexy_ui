import { motion } from "framer-motion";
import styles from "./index.module.css";
import RankLoading from "./rank-loading";
import Panel from "@/app/sections/mining/component/panel";
import TotalPanel from "../mobile/total-panel";
import InviteFrenz from "../mobile/panels/invite-frenz";
import LikeToEarn from "../mobile/panels/like-to-earn";
import FollowX from "../mobile/panels/follow-x";
import CreateToEarn from "../mobile/panels/create-to-earn";
import Rank from "../component/rank";
import { useConfig } from "@/app/store/useConfig";

export default function Laptop({
  info,
  infoLoading,
  userInfo,
  rate,
  rateLoading,
  onQuery
}: any) {
  const configStore: any = useConfig();

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
              <InviteFrenz rate={rate} />
              <LikeToEarn info={info} userInfo={userInfo} />
              <FollowX />
              {info?.clime_created && (
                <CreateToEarn
                  airdropEndTime={configStore.AirdropEndTime}
                  info={info}
                />
              )}
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
    </>
  );
}

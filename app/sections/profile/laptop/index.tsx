import styles from "./index.module.css";
import Level from "@/app/components/level";
import FollowBtn from "../components/followBtn";
import FollowerActions from "../components/follower-actions";
import Tabs from "../components/tabs";
import { AnimatePresence, motion } from "framer-motion";
import Empty from "@/app/components/empty";
import CircleLoading from "@/app/components/icons/loading";
import { defaultAvatar } from "@/app/utils/config";
import { useState } from "react";
import EditButton from "./edit-button";
import EditProfile from "./panels/edit-profile";
import FollowersPanel from "./panels/followers";
import { formatLongText } from "@/app/utils/common";
import { formatAddress } from "@/app/utils";
import { useSearchParams } from "next/navigation";
import GoBack from "@/app/components/back/laptop";
import Summaries from "../components/summaries";
import { SHOW_COPY_TRADE } from "@/app/utils/config";

export default function Laptop({
  userInfo,
  address,
  isFollower,
  refreshNum,
  setRefreshNum,
  onQueryInfo,
  showHot = true,
  isOther = false,
  isLoading
}: any) {
  const [followModalType, setFollowModalType] = useState("");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const search = useSearchParams();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.Container}
    >
      <div className={styles.TitleWrapper}>
        {["profile", "messages", "detail", "trends"].includes(
          search.get("from") || ""
        ) && <GoBack text="" />}
        Profile
      </div>
      <div className={styles.Content}>
        {(
          <>
            <div className={styles.Top}>
              <img
                src={userInfo?.icon || defaultAvatar}
                className={styles.Avatar}
              />
              <div className={styles.DescWrapper}>
                <div className={styles.Desc}>
                  <div className={styles.NameTop}>
                    <div className={styles.NameWrapper}>
                      <div>
                        {formatLongText(userInfo?.name, 9, 4) ||
                          formatAddress(userInfo?.address) ||
                          formatAddress(address) ||
                          "FlipN"}
                      </div>
                      <Level level={userInfo?.level} style={{ marginLeft: 24 }} />
                      {!isOther && (
                        <EditButton
                          onClick={() => {
                            setShowEdit(true);
                          }}
                        />
                      )}
                    </div>
                    {isOther &&  (
                      <div className={styles.Buttons}>
                        <FollowBtn
                          address={address}
                          isFollower={isFollower}
                          onSuccess={async () => {
                            setRefreshNum(refreshNum + 1);
                            onQueryInfo();
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <FollowerActions
                    userInfo={userInfo}
                    onItemClick={(action: string) => {
                      setFollowModalType(action);
                      setShowFollowers(true);
                    }}
                    style={{
                      padding: "0px",
                      gap: "30px",
                      justifyContent: "start",
                      marginTop: "10px",
                      width: 200
                    }}
                    refreshNum={refreshNum}
                    address={address}
                  />
                </div>
              </div>
            
            </div>
            {/* {SHOW_COPY_TRADE && (
                    <Summaries
                      address={address}
                      isFollower={isFollower}
                      setRefreshNum={setRefreshNum}
                      refreshNum={refreshNum}
                      userInfo={userInfo}
                      isOther={isOther}
                    />
                  )} */}
            <Tabs
              address={address}
              showHot={showHot}
              isOther={isOther}
              from="page"
              style={{
                position: "relative"
              }}
              tabContentStyle={{
                padding: "22px 30px 0",
                height: "calc(100vh - 280px)",
                overflowY: "auto",
                flex: "0"
              }}
              tabHeaderStyle={{
                flex: 0,
                padding: "0px 30px"
              }}
              tabHeadersStyle={{
                overflowX: "auto",
                height: "47px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                justifyContent: "flex-start"
              }}
              cursorStyle={{
                height: 3,
                background: "var(--part-bg)",
                borderRadius: 2,
                bottom: 0,
                width: "52px",
                filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.25))"
              }}
            />
          </>
        )}
         {/* : isLoading ? (
          <div className={styles.LoadingWrapper}>
            <CircleLoading size={40} />
          </div>
        ) : (
          <Empty text="No Data" height="600px" />
        )} */}
      </div>
      <AnimatePresence mode="wait">
        {showEdit && (
          <EditProfile
            onClose={() => {
              setShowEdit(false);
            }}
            onSuccess={() => {
              onQueryInfo();
              setShowEdit(false);
            }}
          />
        )}
        {showFollowers && (
          <FollowersPanel
            address={address}
            userInfo={userInfo}
            action={followModalType}
            onClose={() => {
              setShowFollowers(false);
            }}
            onSuccess={() => {
              setRefreshNum(refreshNum + 1);
              onQueryInfo();
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

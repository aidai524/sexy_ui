import Back from "@/app/components/back";
import styles from "./follower.module.css";
import Tab from "../components/tab";
import FollowerList from "./component/followerList";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatAddress } from "@/app/utils";
import useUserInfo from "../../../hooks/useUserInfo";
import { useAuth } from "@/app/context/auth";

export default function Follower({
  address,
  action: defaultAction,
  onSuccess
}: any) {
  const params = useSearchParams();
  const [account] = useState(params.get("account")?.toString() || address);
  const [action] = useState(params.get("action")?.toString() || defaultAction);
  const { userInfo: currentUser, accountRefresher } = useAuth();
  const isOther = useMemo(
    () => account !== currentUser.address,
    [currentUser, account]
  );
  const { userInfo, onQueryInfo } = useUserInfo(
    account,
    !isOther,
    accountRefresher
  );
  const [activeNode, setActiveNode] = useState("");

  const [refeashFollowers, setRefeashFollowers] = useState(0);
  const [refeashFollowing, setRefeashFollowing] = useState(0);

  useEffect(() => {
    if (userInfo && action) {
      if (action === "following") {
        setActiveNode((userInfo?.following || 0) + " Following");
      } else if (action === "follower") {
        setActiveNode((userInfo?.followers || 0) + " Followers");
      }
    }
  }, [userInfo, action]);

  return (
    <div className={styles.main}>
      {!address && (
        <div className={styles.header}>
          <Back />
          <div>
            {userInfo &&
              (userInfo?.name || formatAddress(userInfo?.address as string))}
          </div>
        </div>
      )}

      <Tab
        activeNode={activeNode}
        onTabChange={() => {}}
        nodes={[
          {
            name: (userInfo?.followers || 0) + " Followers",
            content: (
              <FollowerList
                refresh={refeashFollowers}
                currentUser={userInfo}
                followerType={1}
                onAction={() => {
                  onQueryInfo();
                  setRefeashFollowing(refeashFollowing + 1);
                  onSuccess?.();
                }}
                isOther={isOther}
              />
            )
          },
          {
            name: (userInfo?.following || 0) + " Following",
            content: (
              <FollowerList
                refresh={refeashFollowing}
                currentUser={userInfo}
                followerType={2}
                onAction={() => {
                  onQueryInfo();
                  setRefeashFollowers(refeashFollowers + 1);
                  onSuccess?.();
                }}
                isOther={isOther}
              />
            )
          }
        ]}
        tabHeaderStyle={{
          flexShrink: 0,
          padding: "10px 15px",
          fontSize: "14px",
          marginTop: 20
        }}
        tabHeadersStyle={{
          overflowX: "auto",
          height: "unset"
        }}
        cursorStyle={{
          height: 3,
          borderRadius: 2,
          bottom: 0,
          width: "55%",
          background: "var(--part-bg)"
        }}
      />
    </div>
  );
}

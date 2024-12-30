import Back from "@/app/components/back";
import styles from "./follower.module.css";
import Tab from "../components/tab";
import FollowerList from "./component/followerList";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { httpGet, httpAuthGet, formatAddress } from "@/app/utils";
import useUserInfo from "../../../hooks/useUserInfo";

export default function Follower() {
  const params = useSearchParams();
  const [account] = useState(params.get("account")?.toString());
  const [action] = useState(params.get("action")?.toString());
  const { userInfo, onQueryInfo } = useUserInfo(account);
  const [activeNode, setActiveNode] = useState("");

  const [refeashFollowers, setRefeashFollowers] = useState(0);
  const [refeashFollowing, setRefeashFollowing] = useState(0);

  console.log("userInfo:", userInfo);
  console.log("action:", action);

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
      <div className={styles.header}>
        <Back />
        <div>
          {userInfo &&
            (userInfo?.name || formatAddress(userInfo?.address as string))}
        </div>
      </div>

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
                }}
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
                }}
              />
            )
          }
        ]}
      />
    </div>
  );
}

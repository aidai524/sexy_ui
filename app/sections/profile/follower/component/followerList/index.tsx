import type { UserInfo } from "@/app/type";
import styles from "./follow.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import List from "./list";
import useFollowList from "../../../hooks/useFollowList";
import { useRouter } from "next/navigation";

interface Props {
  followerType: number;
  refresh: number;
  onAction?: () => void;
  currentUser: UserInfo | undefined;
}

export default function FollowerList({
  followerType,
  currentUser,
  onAction,
  refresh
}: Props) {
  const { isMobile } = useUserAgent();
  const router = useRouter();

  const { list, userInfo, setList, isLoading, hasMore, loadMore } =
    useFollowList({
      currentUser,
      followerType,
      refresh
    });

  return (
    <div
      className={styles.main}
      style={{
        backgroundColor: isMobile ? "rgba(255, 255, 255, 0.08)" : "transparent"
      }}
    >
      <List
        {...{
          list,
          userInfo,
          followerType,
          onAction,
          setList,
          isLoading,
          loadMore,
          hasMore,
          onItemClick(item: any) {
            router.push("/profile/user?account=" + item.address);
          }
        }}
      />
    </div>
  );
}

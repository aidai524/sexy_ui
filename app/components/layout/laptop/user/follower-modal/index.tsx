import Modal from "@/app/components/modal";
import SearchIcon from "@/app/components/icons/search";
import FollowerList from "@/app/sections/profile/follower/component/followerList/list";
import styles from "./index.module.css";
import { useMemo, useState } from "react";
import useFollowList from "@/app/sections/profile/hooks/useFollowList";

export default function FollowerModal({
  address,
  type,
  open,
  onClose,
  onRefresh
}: any) {
  const [searchVal, setSearchVal] = useState("");
  const [refresh, setRefresh] = useState(0);

  const followerType = useMemo(() => (type === "following" ? 2 : 1), [type]);

  const { list, userInfo, setList, isLoading, hasMore, loadMore } =
    useFollowList({
      currentUser: { address },
      followerType,
      refresh
    });

  const filteredList = useMemo(() => {
    if (!list?.length) return [];
    return list.filter((item: any) => item.name.includes(searchVal));
  }, [list, type]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      mainStyle={{
        width: 498,
        borderColor: "#FFFFFF33",
        backgroundColor: "#18131C"
      }}
    >
      <div className={styles.Container}>
        <div className={styles.Title}>
          {list?.length || 0} {type === "following" ? `Following` : `Followers`}
        </div>
        <div className={styles.InputContainer}>
          <SearchIcon />
          <input
            className={styles.Input}
            value={searchVal}
            onChange={(ev) => {
              setSearchVal(ev.target.value);
            }}
          />
        </div>
        <div className={styles.ListContainer}>
          <FollowerList
            {...{
              list: filteredList,
              userInfo,
              followerType: followerType,
              onAction() {
                onRefresh();
                setRefresh(refresh + 1);
              },
              setList,
              isLoading,
              loadMore,
              hasMore
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

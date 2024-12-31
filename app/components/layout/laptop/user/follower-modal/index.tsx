import Modal from "@/app/components/modal";
import SearchIcon from "@/app/components/icons/search";
import FollowerList from "@/app/sections/profile/follower/component/followerList/list";
import styles from "./index.module.css";
import { useMemo, useState } from "react";
import useFollowList from "@/app/sections/profile/hooks/useFollowList";
import { useAccount } from "@/app/hooks/useAccount";
import { formatAddress } from "@/app/utils";

export default function FollowerModal({
  address,
  type,
  open,
  onClose,
  onRefresh
}: any) {
  const [searchVal, setSearchVal] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { address: walletAddress } = useAccount();
  const followerType = useMemo(() => (type === "following" ? 2 : 1), [type]);

  const currentUser = useMemo(() => ({ address }), [address]);

  const { list, userInfo, setList, isLoading, hasMore, loadMore } =
    useFollowList({
      currentUser,
      followerType,
      refresh
    });

  const filteredList = useMemo(() => {
    if (!list?.length) return [];
    return list.filter((item: any) => item.name.includes(searchVal));
  }, [list, type]);

  const title = useMemo(() => {
    let prev = "";
    if (walletAddress === address) {
      prev = "My";
    } else {
      prev = `${userInfo?.name || formatAddress(address)}'s`;
    }
    return `${prev} ${type === "following" ? `Following` : `Followers`} (${
      list?.length || 0
    })`;
  }, [type, list, walletAddress, userInfo, address]);
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
        <div className={styles.Title}>{title}</div>
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
                onRefresh?.();
                setRefresh(refresh + 1);
              },
              setList,
              isLoading,
              loadMore,
              hasMore,
              onItemClick(item: any) {
                history.pushState(
                  { page: "/profile/user" },
                  "Profile",
                  "/profile/user?account=" + item.address
                );
                onClose();
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

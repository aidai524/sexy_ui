import Modal from "@/app/components/modal";
import SearchIcon from "@/app/components/icons/search";
import FollowerList from "@/app/sections/profile/follower/component/followerList";
import styles from "./index.module.css";
import { useMemo, useState } from "react";
import useFollow from "@/app/sections/profile/hooks/useFollow";

export default function FollowerModal({ address, type, open, onClose }: any) {
  const { followerList, followingList } = useFollow(address);
  const [searchVal, setSearchVal] = useState("");
  const list = useMemo(() => {
    if (!type) return [];
    return type === "following" ? followingList : followerList;
  }, [type]);
  const filteredList = useMemo(() => {
    if (!list?.length) return [];
    return list.filter((item: any) => item.name.includes(searchVal));
  }, [list, type]);
  return (
    <Modal open={open} onClose={onClose} mainStyle={{ width: 498 }}>
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
            list={filteredList}
            followerType={type === "following" ? 2 : 1}
          />
        </div>
      </div>
    </Modal>
  );
}

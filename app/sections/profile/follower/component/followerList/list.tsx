import styles from "./list.module.css";
import { defaultAvatar } from "@/app/utils/config";
import InfiniteScroll from "@/app/components/sexInfiniteScroll";
import { formatAddress } from "@/app/utils";

import FollowBtn from "../../../components/followBtn";
import Empty from "@/app/components/empty";

export default function List({
  list,
  userInfo,
  followerType,
  onAction,
  setList,
  isLoading,
  loadMore,
  hasMore,
  onItemClick
}: any) {
  return (
    <>
      {list.map((item: any) => {
        return (
          <div className={styles.follower} key={item.address}>
            <div
              className={`${styles.followerContent} button`}
              onClick={() => {
                onItemClick(item);
              }}
            >
              <img className={styles.img} src={item.icon || defaultAvatar} />
              <div className={styles.nameContent}>
                <div className={styles.name}>
                  {item.name || formatAddress(item.address)}
                </div>
                <div className={styles.followers}>
                  {item.followers} followers
                </div>
              </div>
            </div>

            <div className={styles.followerAction}>
              {userInfo.address === item.address ? (
                <div className={styles.me}>It{"'"}s me</div>
              ) : (
                <FollowBtn
                  address={item.address}
                  isFollower={item.isFollower}
                  onSuccess={() => {
                    if (followerType === 2 && item.isFollower) {
                      let curIndex = -1;
                      list.some((listItem: any, index: number) => {
                        if (listItem === item) {
                          curIndex = index;
                          return true;
                        }
                        return false;
                      });

                      if (curIndex !== -1) {
                        list.splice(curIndex, 1);
                      }
                    }

                    item.isFollower = !item.isFollower;
                    setList([...list]);
                    onAction && onAction();
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {(!list || list.length === 0) && !isLoading && (
        <Empty height={300} text="No Data" />
      )}

      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </>
  );
}

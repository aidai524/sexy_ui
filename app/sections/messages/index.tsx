"use client";

import styles from "./index.module.css";
import PageHeader from "@/app/components/page-header/mobile";
import useList from "@/app/components/messages/use-list";
import Header from "@/app/components/messages/header";
import Empty from "@/app/components/empty";
import CircleLoading from "@/app/components/icons/loading";
import { InfiniteScroll } from "antd-mobile";
import Item from "./item";
import { useUserAgent } from "@/app/context/user-agent";
import { useMessages } from "@/app/context/messages";
import { useState, useMemo, useEffect } from "react";
import useRead from "@/app/components/messages/use-read";

export default function Messages() {
  const { innerHeight } = useUserAgent();
  const { num, onQuery } = useMessages();
  const [informNum, setInforNum] = useState(num);
  const { list, loading, hasMore, page, onNextPage } = useList();
  const { onRead } = useRead();
  const [currentTab, setCurrentTab] = useState("inform");

  const isFirstPage = useMemo(() => page.current === 1, [page.current]);

  useEffect(() => {
    setInforNum(num);
  }, [num]);

  return (
    <div className={styles.Container} style={{ height: innerHeight }}>
      <PageHeader
        title="Messages"
        from="messages"
        rightActions={
          <button
            className={styles.ReadAll}
            onClick={() => {
              onRead({
                ids: [],
                onSuccess: onQuery
              });
            }}
          >
            Read all
          </button>
        }
      />
      <div className={styles.Content} style={{ height: innerHeight - 46 }}>
        <Header
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          num={informNum}
        />

        <div
          className={styles.Content}
          style={{
            padding: "10px"
          }}
        >
          {list.map((item: any) => (
            <Item
              key={item.id}
              item={item}
              isMobile={true}
              onRead={onRead}
              onSuccess={() => {
                if (informNum > 0) {
                  setInforNum(informNum - 1);
                }
              }}
            />
          ))}
          {list.length > 0 && (
            // @ts-ignore
            <InfiniteScroll loadMore={onNextPage} hasMore={hasMore}>
              {hasMore && <CircleLoading size={20} />}
            </InfiniteScroll>
          )}
          {list.length === 0 && !loading ? (
            <Empty height={300} text="No new informations" />
          ) : (
            isFirstPage && (
              <div className={styles.LoadingWrapper}>
                <CircleLoading size={30} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

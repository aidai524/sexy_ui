import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import MessagesModal from "./modal";
import useNum from "./use-num";
import useList from "./use-list";
import { useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function MessagesAlarm() {
  const [showModal, setShowModal] = useState(false);
  const { num, onQuery: onQueryNum } = useNum();
  const { list, loading, hasMore, page, onNextPage, onInit } = useList({
    onSuccess: onQueryNum,
    showModal
  });

  const { userInfo } = useAuth();

  const feeds: any = [];

  return (
    <>
      <Badge isSimple={true} number={num}>
        <div
          style={{
            position: "relative"
          }}
        >
          <div
            className="button"
            onClick={() => {
              if (!userInfo) {
                // @ts-ignore
                window?.connect();
                return;
              }
              setShowModal(true);
            }}
          >
            <AlarmIcon />
          </div>
          {/* {showPop && (
            <MessagesPop
              onClose={() => {
                setShowPop(false);
              }}
              onShowMore={() => {
                setShowModal(true);
                setShowPop(false);
              }}
              list={list?.slice(0, 4)}
              feeds={feeds}
              loading={loading}
              onRead={onRead}
              num={num}
            />
          )} */}
        </div>
      </Badge>
      <MessagesModal
        open={showModal}
        list={list}
        feeds={feeds}
        loading={loading}
        page={page}
        onNextPage={onNextPage}
        onClose={() => {
          setShowModal(false);
        }}
        num={num}
        hasMore={hasMore}
      />
    </>
  );
}

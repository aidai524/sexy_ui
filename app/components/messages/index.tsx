import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import MessagesPop from "@/app/components/messages/popover";
import MessagesModal from "./modal";
import useNum from "./use-num";
import useList from "./use-list";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth";

export default function MessagesAlarm() {
  const [showModal, setShowModal] = useState(false);
  const { num, onQuery: onQueryNum } = useNum();
  const { list, loading, hasMore, onNextPage, onInit } = useList({
    onSuccess: onQueryNum
  });

  const { userInfo } = useAuth();

  const feeds: any = [];

  useEffect(() => {
    if (showModal) {
      onInit();
    }
  }, [showModal]);

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
              if (list?.length) {
                setShowModal(true);
              }
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

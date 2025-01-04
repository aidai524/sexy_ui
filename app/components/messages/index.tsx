import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import MessagesPop from "@/app/components/messages/popover";
import MessagesModal from "./modal";
import useNum from "./use-num";
import useList from "./use-list";
import { useEffect, useState } from "react";
import useRead from "./use-read";
import { useAuth } from "@/app/context/auth";

export default function MessagesAlarm() {
  const [showPop, setShowPop] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const { list, loading, hasMore, onNextPage, onQuery } = useList();
  const { num, onQuery: onQueryNum } = useNum();
  const { userInfo } = useAuth();
  const { onRead } = useRead();
  const feeds: any = [];
  useEffect(() => {
    if (showPop === false) {
      onRead({
        ids: list.slice(0, 4).map((item: any) => item.id)
      });
    }
  }, [showPop]);
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
                setShowPop(true);
              }
            }}
          >
            <AlarmIcon />
          </div>
          {showPop && (
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
          )}
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
        onRead={onRead}
      />
    </>
  );
}

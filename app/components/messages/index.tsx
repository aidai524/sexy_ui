import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import MessagesPop from "@/app/components/messages/popover";
import MessagesModal from "./modal";
import useNum from "./use-num";
import useList from "./use-list";
import { useState } from "react";
import useRead from "./use-read";

export default function MessagesAlarm() {
  const [showPop, setShowPop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { list, loading, onNextPage, onQuery } = useList();
  const { num, onQuery: onQueryNum } = useNum();
  const { onRead } = useRead();
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
              if (list?.length) {
                setShowPop(true);
                onRead({
                  ids: list.slice(0, 4).map((item: any) => item.id),
                  onSuccess() {
                    onQuery();
                  }
                });
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
        onRead={onRead}
      />
    </>
  );
}

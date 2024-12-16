import Badge from "@/app/components/badge";
import AlarmIcon from "@/app/components/icons/alarm";
import MessagesPop from "@/app/components/messages/popover";
import MessagesModal from "./modal";
import { useState } from "react";

export default function MessagesAlarm() {
  const [showPop, setShowPop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Badge>
        <div
          style={{
            position: "relative"
          }}
        >
          <div
            className="button"
            onClick={() => {
              setShowPop(true);
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
            />
          )}
        </div>
      </Badge>
      <MessagesModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

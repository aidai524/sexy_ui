import Modal from "../modal";
import Header from "./header";
import Item from "./item";
import styles from "./modal.module.css";
import { useState, useMemo, useRef } from "react";

export default function MessagesModal({
  open,
  onClose,
  list,
  feeds,
  onRead,
  onNextPage
}: any) {
  const ContentRef = useRef<any>();
  const [currentTab, setCurrentTab] = useState("inform");
  const data = useMemo(
    () => (currentTab === "inform" ? list : feeds),
    [currentTab]
  );
  return (
    <Modal
      open={open}
      mainStyle={{
        border: "none"
      }}
    >
      <div className={styles.Container}>
        <Header
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          onClose={onClose}
        />
        <div className={styles.Content} ref={ContentRef}>
          {data.map((item: any) => (
            <Item key={item.msg_id} item={item} />
          ))}
          {data.length === 0 && (
            <div className={styles.EmptyText}>No information</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

import Modal from "../modal";
import Header from "./header";
import Item from "./item";
import styles from "./modal.module.css";
import { useState } from "react";

export default function MessagesModal({ open, onClose }: any) {
  const [currentTab, setCurrentTab] = useState("inform");
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
        <div className={styles.Content}>
          <Item />
          <Item />
          <Item />
          <Item />
          {/* <div className={styles.EmptyText}>No information</div> */}
        </div>
      </div>
    </Modal>
  );
}

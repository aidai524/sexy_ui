import Modal from "../../modal";
import styles from "./laptop.module.css";
import Trade from "../trade";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onHide }: Props) {
  return (
    <Modal
      open={show}
      onClose={() => {
        onHide && onHide();
      }}
      mainStyle={{ width: 502, border: "none" }}
    >
      <div className={styles.Container}>
        <img className={styles.Img} src="/img/home/smokeHotLogo.svg" />

        <Trade
          token={token}
          panelStyle={{
            backgroundColor: "transparent"
          }}
          onSuccess={() => {
            onHide && onHide();
          }}
        />
      </div>
    </Modal>
  );
}

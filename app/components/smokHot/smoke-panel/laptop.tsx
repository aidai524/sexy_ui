import Modal from "../../modal";
import styles from "./laptop.module.css";
import Trade from "../trade";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onSuccess: () => void;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onHide, onSuccess }: Props) {
  return (
    <Modal
      open={show}
      onClose={() => {
        onHide && onHide();
      }}
      mainStyle={{ width: 502, border: "none" }}
      closeStyle={{
        display: "none"
      }}
    >
      <div className={styles.Container}>
        <img className={styles.Img} src="/img/home/flipLogo.png" />

        <Trade
          modalShow={show}
          token={token}
          panelStyle={{
            backgroundColor: "transparent"
          }}
          onClose={() => {
            onHide && onHide();
          }}
          onSuccess={() => {
            onSuccess && onSuccess();
          }}
        />
      </div>
    </Modal>
  );
}

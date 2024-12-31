import Modal from "../../modal";
import styles from "./laptop.module.css";
import Trade from "../trade";
import { useLaptop } from "@/app/context/laptop";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onHide }: Props) {
  const { updateInfo } = useLaptop();
  return (
    <Modal
      open={show}
      onClose={() => {
        onHide && onHide();
      }}
      mainStyle={{ width: 502, border: "none" }}
    >
      <div className={styles.Container}>
        <img className={styles.Img} src="/img/home/flipLogo.png" />

        <Trade
          modalShow={show}
          token={token}
          panelStyle={{
            backgroundColor: "transparent"
          }}
          onSuccess={() => {
            updateInfo("flip");
            onHide && onHide();
          }}
        />
      </div>
    </Modal>
  );
}

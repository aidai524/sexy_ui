import { Popup } from "antd-mobile";
import styles from "./mobile.module.css";
import Trade from "../trade";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onHide }: Props) {
  return (
    <Popup
      visible={show}
      onMaskClick={() => {
        onHide && onHide();
      }}
      onClose={() => {
        onHide && onHide();
      }}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <div className={styles.main}>
        <div className={styles.smokeLogo}>
          <img className={styles.smokeImg} src="/img/home/smokeHotLogo.svg" />
        </div>

        <Trade
          token={token}
          onSuccess={() => {
            onHide && onHide();
          }}
        />
      </div>
    </Popup>
  );
}

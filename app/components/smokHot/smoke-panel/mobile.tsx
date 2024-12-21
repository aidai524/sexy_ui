import { Popup } from "antd-mobile";
import styles from "./mobile.module.css";
import Trade from "../trade";
import type { Project } from "@/app/type";

interface Props {
  show: boolean;
  token: Project;
  onSuccess: () => void;
  onHide?: () => void;
}

export default function SmokPanel({ show, token, onSuccess, onHide }: Props) {


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
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
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
            onSuccess && onSuccess()
          }}
        />
      </div>
    </Popup>
  );
}

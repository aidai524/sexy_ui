import { Modal, Popup } from "antd-mobile";
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
      closeOnMaskClick
      className="no-bg trans-flip"
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
          <img className={styles.smokeImg} src="/img/home/flipLogo.png" />
        </div>
        <Trade
          modalShow={show}
          token={token}
          onClose={() => {
            onHide && onHide();
          }}
          onSuccess={() => {
            onSuccess && onSuccess();
          }}
          panelStyle={{
            padding: "0px 14px 20px"
          }}
        />
      </div>
    </Popup>
  );
}

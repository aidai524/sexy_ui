import { Popup } from "antd-mobile";
import Content from "./content";

export default function Mobile({ show, onClose, data, initType }: any) {
  return (
    <Popup
      visible={show}
      onMaskClick={onClose}
      onClose={onClose}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <Content {...{ onClose, data, initType }} />
    </Popup>
  );
}

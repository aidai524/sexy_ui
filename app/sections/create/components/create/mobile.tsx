import { Popup } from "antd-mobile";
import Content from "./content";

export default function Create({
  show,
  onHide,
  setShowSuccessModal,
  ...rest
}: any) {
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
        paddingTop: 30,
        paddingBottom: 30
        // height: '50vh'
      }}
    >
      <Content {...{ onHide, setShowSuccessModal, ...rest }} />
    </Popup>
  );
}

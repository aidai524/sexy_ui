import { Popup } from "antd-mobile";
import ActionList from "../actionList";
export default function Mobile(props: any) {
  const {
    modalShow,
    setModalShow,
    token,
    isOther,
    prepaidWithdrawDelayTime
  } = props;
  return (
    <Popup
      visible={modalShow}
      onMaskClick={() => {
        setModalShow(false);
      }}
      onClose={() => {
        setModalShow(false);
      }}
      bodyStyle={{
        borderTopLeftRadius: "30px",
        borderTopRightRadius: "30px",
        paddingTop: 0,
        paddingBottom: 0
        // height: '50vh'
      }}
    >
      <ActionList
        {...props}
      />
    </Popup>
  );
}

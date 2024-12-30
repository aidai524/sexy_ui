import { Popup } from "antd-mobile";
import ActionList from "../actionList";
export default function Mobile({
  modalShow,
  setModalShow,
  token,
  isOther,
  prepaidWithdrawDelayTime
}: any) {
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
        isOther={isOther}
        token={token}
        isOther={true}
        prepaidWithdrawDelayTime={prepaidWithdrawDelayTime}
      />
    </Popup>
  );
}

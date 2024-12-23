import Content from "./content";
import Modal from "../modal";

export default function Mobile({ show, onClose, data, initType }: any) {
  return (
    <Modal
      open={show}
      onClose={onClose}
      mainStyle={{
        width: 502,
        borderColor: "#AAFF00",
        backgroundColor: "#0000001A",
        padding: "30px"
      }}
    >
      <Content {...{ onClose, data, initType }} />
    </Modal>
  );
}

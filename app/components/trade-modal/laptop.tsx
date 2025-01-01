import Content from "./content";
import Modal from "../modal";

export default function Laptop({ show, onClose, data, initType }: any) {
  return (
    <Modal
      open={show}
      onClose={onClose}
      mainStyle={{
        width: 502,
        borderColor: "#AAFF00",
        backgroundColor: "#19030D",
        padding: "30px"
      }}
    >
      <Content {...{ onClose, data, initType }} />
    </Modal>
  );
}

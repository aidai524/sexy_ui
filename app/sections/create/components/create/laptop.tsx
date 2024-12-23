import Content from "./content";
import Modal from "@/app/components/modal";

export default function Laptop({
  show,
  onHide,
  setShowSuccessModal,
  ...rest
}: any) {
  return (
    <Modal
      open={show}
      onClose={onHide}
      mainStyle={{
        width: 502,
        borderColor: "#FFFFFF33",
        backgroundColor: "#18131C",
        padding: "30px"
      }}
    >
      <Content {...{ onHide, setShowSuccessModal, ...rest }} />
    </Modal>
  );
}

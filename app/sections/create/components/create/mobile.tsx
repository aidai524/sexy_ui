import Modal from "@/app/components/modal";
import Content from "./content";

export default function Create({
  show,
  onHide,
  setShowSuccessModal,
  onBeforeCreate,
  ...rest
}: any) {
  return (
    <Modal
      open={show}
      onClose={onHide}
      animation="popup"
      closeStyle={{
        display: "none"
      }}
    >
      <Content {...{ onHide, setShowSuccessModal, onBeforeCreate, ...rest }} width="100vw" />
    </Modal>
  );
}

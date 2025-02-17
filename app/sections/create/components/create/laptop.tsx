import Content from "./content";
import Modal from "@/app/components/modal";

export default function Laptop({
  show,
  onHide,
  setShowSuccessModal,
  onBeforeCreate,
  ...rest
}: any) {
  return (
    <Modal open={show} onClose={onHide}>
      <Content {...{ onHide, setShowSuccessModal, onBeforeCreate, ...rest }} width="375px" />
    </Modal>
  );
}

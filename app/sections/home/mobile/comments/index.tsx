import Modal from "@/app/components/modal";
import Content from "./content";

export default function Comments({
  from,
  show,
  id,
  total,
  onClose,
  onSuccess
}: any) {
  return (
    <Modal
      open={show}
      onClose={onClose}
      animation="popup"
      closeStyle={{ display: "none" }}
    >
      <Content {...{ from, id, total, onClose, onSuccess }} />
    </Modal>
  );
}

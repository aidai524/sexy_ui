import Modal from "@/app/components/modal";
import Content from "./content";

export default function Create({
  setShowSuccessModal,
  onBeforeCreate,
  ...rest
}: any) {
  return (
    <Content {...{ setShowSuccessModal, onBeforeCreate, ...rest }} width="100vw" />
  );
}

import Modal from "@/app/components/modal";
import Content from "./content";
export default function Laptop({
  show,
  token,
  slipData,
  onSlipDataChange,
  onHide
}: any) {
  return (
    <Modal
      open={show}
      onClose={onHide}
      mainStyle={{
        width: 360,
        borderColor: "#FFFFFF33",
        backgroundColor: "#18131C"
      }}
    >
      <Content
        {...{
          onHide,
          token,
          slipData,
          onSlipDataChange
        }}
      />
    </Modal>
  );
}

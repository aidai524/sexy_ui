import { Modal } from "antd-mobile";
import BoostVip from "@/app/components/boost/boostVip";

export default function VipModal({ show, onClose }: any) {
  const VipModal = <BoostVip onStartVip={() => {}} onCanceVip={onClose} />;
  return (
    <Modal
      visible={show}
      content={VipModal}
      closeOnAction
      closeOnMaskClick
      onClose={onClose}
    />
  );
}

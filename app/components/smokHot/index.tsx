import { useState } from "react";
import SmokPanel from "./smoke-panel";
import type { Project } from "@/app/type";
import { Modal } from "antd-mobile";
import BoostVip from "../boost/boostVip";
import { useUser } from "@/app/store/useUser";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
  token: Project;
  onClick: () => void;
}

export default function SmokeBtn({ onClick, token }: Props) {
  const [panelShow, setPanelShow] = useState(false);
  const [vipShow, setVipShow] = useState(false);
  const { userInfo }: any = useUser()
  const { address } = useAccount()


  const VipModal = (
    <BoostVip
      onStartVip={() => {
        setPanelShow(true)
      }}
      onCanceVip={() => {
        setVipShow(false);
      }}
    />
  );

  return (
    <div
      onClick={() => {
        if (!address) {
          //@ts-ignore
          window.connect()
          return
        }

        if (userInfo.superLikeNum - userInfo.usingSuperLikeNum > 0) {
          setPanelShow(true);
        } else {
          setVipShow(true)
        }
        onClick();
      }}
    >
      <div style={{ width: 48, height: 48, overflow: 'hidden' }}>
        <img style={{ width: 48 }} src="/img/profile/smoke-hot.png"/>
      </div>

      <Modal
        visible={vipShow}
        content={VipModal}
        closeOnAction
        closeOnMaskClick
        onClose={() => {
          setVipShow(false);
        }}
      />

      <SmokPanel
        token={token}
        show={panelShow}
        onHide={() => {
          setPanelShow(false);
        }}
      />
    </div>
  );
}

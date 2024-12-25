import { useState } from "react";
import SmokPanel from "./smoke-panel";
import type { Project } from "@/app/type";
import { Modal } from "antd-mobile";
import BoostVip from "../boost/boostVip";
import { useUser } from "@/app/store/useUser";
import { useAccount } from "@/app/hooks/useAccount";
import SmokeIcon from "./icon";
import BoostSuperNoTimes from "../boost/boostSuperNoTimes";

interface Props {
  token: Project;
  isBigIcon?: boolean;
  id?: string;
  onClick: () => void;
}

export default function SmokeBtn({
  onClick,
  token,
  isBigIcon = false,
  id
}: Props) {
  const [panelShow, setPanelShow] = useState(false);
  const [vipShow, setVipShow] = useState(false);
  const { userInfo }: any = useUser();
  const { address } = useAccount();
  const [boostSuperNoTimesShow, setBoostSuperNoTimesShow] = useState(false);

  const VipModal = (
    <BoostVip
      onStartVip={() => {
        setPanelShow(true);
      }}
      onCanceVip={() => {
        setVipShow(false);
      }}
    />
  );

  const BoostSuperNoTimesModal = (
    <BoostSuperNoTimes
      token={token}
      usingNum={userInfo?.usingBoostNum}
      num={userInfo?.superLikeNum}
      onClose={() => {
        setBoostSuperNoTimesShow(false);
      }}
      type={2}
    />
  );

  const size = isBigIcon ? 48 : 36;

  return (
    <div
      onClick={() => {
        if (!address) {
          //@ts-ignore
          window.connect();
          return;
        }

        if (token.isSuperLike || token.account === address) {
          return;
        }

        setPanelShow(true);

        // if (userInfo.superLikeNum - userInfo.usingSuperLikeNum > 0) {
        //   setPanelShow(true);
        // } else {
        //   if (userInfo.vipType === 'vip') {
        //     setBoostSuperNoTimesShow(true)
        //   } else {
        //     setVipShow(true)
        //   }

        // }
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 100,
          backgroundColor: "rgba(0,0,0,0.4",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        {token.isSuperLike || token.account === address ? (
          <SmokeIcon isGrey={true} id={id} />
        ) : (
          <SmokeIcon id={id} />
        )}
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
        onSuccess={() => {
          onClick && onClick();
          setPanelShow(false);
        }}
        onHide={() => {
          setPanelShow(false);
        }}
      />

      <Modal
        visible={boostSuperNoTimesShow}
        content={BoostSuperNoTimesModal}
        closeOnMaskClick
        closeOnAction
        onClose={() => {
          setBoostSuperNoTimesShow(false);
        }}
      />
    </div>
  );
}

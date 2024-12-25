import { useMemo, useState } from "react";
import SmokPanel from "./smoke-panel";
import type { Project } from "@/app/type";
import { Modal } from "antd-mobile";
import BoostVip from "../boost/boostVip";
import { useUser } from "@/app/store/useUser";
import { useAccount } from "@/app/hooks/useAccount";
import BoostSuperNoTimes from "../boost/boostSuperNoTimes";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";

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
  const { prepaidDelayTime } = usePrepaidDelayTimeStore()

  const isDelay = useMemo(() => {
    if (prepaidDelayTime && token.createdAt && Date.now() - token.createdAt > prepaidDelayTime) {
      return true
    }
    return false
  }, [prepaidDelayTime, token])

  const isDisabled = useMemo(() => {
    return token.isSuperLike || token.account === address || isDelay
  }, [isDelay, token, address])

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

        if (isDisabled) {
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
        {isDisabled ? (
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


function SmokeIcon({ isGrey, id }: any) {
  return (
    <svg
      width="25"
      height="30"
      viewBox="0 0 25 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0117341 16.86C-0.13897 14.5993 1.13341 9.96683 5.48848 7.11148C5.76109 6.93274 6.11902 7.11298 6.1694 7.43504C6.42056 9.04044 6.9197 10.0828 7.79399 10.9437C7.91236 11.0603 8.08854 11.0938 8.24353 11.034C11.6839 9.70598 14.3634 7.03375 13.4136 0.519094C13.3612 0.159544 13.7224 -0.121444 14.041 0.0532762C17.9652 2.20542 24.8401 8.45132 24.735 16.86C24.735 26.4122 16.8685 29.6712 12.1486 29.6712C7.42871 29.6712 0.0117341 25.9627 0.0117341 16.86ZM5.18656 15.2327C4.6702 16.0105 4.39439 16.9268 4.39441 17.8644C4.3938 18.5457 4.53919 19.2189 4.82051 19.8376C5.10183 20.4563 5.51236 21.0056 6.02369 21.4475L11.1461 26.01C11.4308 26.2636 11.7953 26.4062 12.1742 26.4123C12.5531 26.4183 12.9218 26.2874 13.2142 26.0429L18.4734 21.6487C19.0575 21.2117 19.532 20.6414 19.8584 19.984C20.1848 19.3266 20.3539 18.6005 20.3521 17.8644C20.3522 16.9268 20.0763 16.0105 19.56 15.2327C19.0436 14.4549 18.3102 13.851 17.4535 13.4981C16.5968 13.1453 15.6557 13.0597 14.7508 13.2521C14.1515 13.3796 13.5862 13.6251 13.0854 13.9716C12.665 14.2624 12.0816 14.2624 11.6612 13.9716C11.1604 13.6251 10.595 13.3796 9.99579 13.2521C9.09081 13.0597 8.14979 13.1453 7.29308 13.4981C6.43637 13.851 5.70293 14.4549 5.18656 15.2327ZM10.1241 17.0346C10.3193 16.9321 10.53 17.1428 10.4276 17.338L9.90004 18.3432C9.86572 18.4086 9.86572 18.4867 9.90004 18.5521L10.4276 19.5572C10.53 19.7524 10.3193 19.9631 10.1241 19.8606L9.11897 19.3331C9.05357 19.2988 8.97548 19.2988 8.91008 19.3331L7.90496 19.8606C7.70971 19.9631 7.49903 19.7524 7.6015 19.5572L8.12901 18.5521C8.16333 18.4867 8.16333 18.4086 8.12901 18.3432L7.6015 17.338C7.49903 17.1428 7.70971 16.9321 7.90496 17.0346L8.91008 17.5621C8.97548 17.5964 9.05357 17.5964 9.11897 17.5621L10.1241 17.0346ZM17.3952 17.338C17.4977 17.1428 17.287 16.9321 17.0917 17.0346L16.0866 17.5621C16.0212 17.5964 15.9431 17.5964 15.8777 17.5621L14.8726 17.0346C14.6774 16.9321 14.4667 17.1428 14.5691 17.338L15.0967 18.3432C15.131 18.4086 15.131 18.4867 15.0967 18.5521L14.5691 19.5572C14.4667 19.7524 14.6774 19.9631 14.8726 19.8606L15.8777 19.3331C15.9431 19.2988 16.0212 19.2988 16.0866 19.3331L17.0917 19.8606C17.287 19.9631 17.4977 19.7524 17.3952 19.5572L16.8677 18.5521C16.8334 18.4867 16.8334 18.4086 16.8677 18.3432L17.3952 17.338Z"
        fill="url(#paint0_linear_1_2)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_2"
          x1="12.3681"
          y1="0"
          x2="12.3681"
          y2="29.6712"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={isGrey ? "#7F708A" : "#D9ABFF"} />
          <stop offset="1" stopColor={isGrey ? "#7F708A" : "#B65AFF"} />
        </linearGradient>
      </defs>
    </svg>
  );
}
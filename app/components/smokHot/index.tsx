import { useState } from "react";
import SmokPanel from "./smoke-panel";
import type { Project } from "@/app/type";
import { Modal } from "antd-mobile";
import BoostVip from "../boost/boostVip";
import { useUser } from "@/app/store/useUser";

interface Props {
  token: Project;
  onClick: () => void;
}

export default function SmokeBtn({ onClick, token }: Props) {
  const [panelShow, setPanelShow] = useState(false);
  const [vipShow, setVipShow] = useState(false);
  const { userInfo }: any = useUser()


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
        if (userInfo.superLikeNum - userInfo.usingSuperLikeNum > 0) {
            setPanelShow(true);
        } else {
            setVipShow(true)
        }
        onClick();
      }}
    >
        <div style={{ width: 48, height: 48, overflow: 'hidden' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
      >
        <circle opacity="0.4" cx="24" cy="24" r="24" fill="black" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0117 25.86C11.861 23.5993 13.1334 18.9668 17.4885 16.1115C17.7611 15.9327 18.119 16.113 18.1694 16.435C18.4206 18.0404 18.9197 19.0828 19.794 19.9437C19.9124 20.0603 20.0885 20.0938 20.2435 20.034C23.6839 18.706 26.3634 16.0337 25.4136 9.51909C25.3612 9.15954 25.7224 8.87856 26.041 9.05328C29.9652 11.2054 36.8401 17.4513 36.735 25.86C36.735 35.4122 28.8685 38.6712 24.1486 38.6712C19.4287 38.6712 12.0117 34.9627 12.0117 25.86ZM17.1866 24.2327C16.6702 25.0105 16.3944 25.9268 16.3944 26.8644C16.3938 27.5457 16.5392 28.2189 16.8205 28.8376C17.1018 29.4563 17.5124 30.0056 18.0237 30.4475L23.1461 35.01C23.4309 35.2636 23.7953 35.4062 24.1742 35.4123C24.5531 35.4183 24.9218 35.2874 25.2142 35.0429L30.4734 30.6487C31.0575 30.2117 31.532 29.6414 31.8584 28.984C32.1848 28.3266 32.3539 27.6005 32.3521 26.8644C32.3522 25.9268 32.0763 25.0105 31.56 24.2327C31.0436 23.4549 30.3102 22.851 29.4535 22.4981C28.5968 22.1453 27.6557 22.0597 26.7508 22.2521C26.1515 22.3796 25.5862 22.6251 25.0854 22.9716C24.665 23.2624 24.0816 23.2624 23.6612 22.9716C23.1604 22.6251 22.595 22.3796 21.9958 22.2521C21.0908 22.0597 20.1498 22.1453 19.2931 22.4981C18.4364 22.851 17.7029 23.4549 17.1866 24.2327ZM22.1241 26.0346C22.3193 25.9321 22.53 26.1428 22.4276 26.338L21.9 27.3432C21.8657 27.4086 21.8657 27.4867 21.9 27.5521L22.4276 28.5572C22.53 28.7524 22.3193 28.9631 22.1241 28.8606L21.119 28.3331C21.0536 28.2988 20.9755 28.2988 20.9101 28.3331L19.905 28.8606C19.7097 28.9631 19.499 28.7524 19.6015 28.5572L20.129 27.5521C20.1633 27.4867 20.1633 27.4086 20.129 27.3432L19.6015 26.338C19.499 26.1428 19.7097 25.9321 19.905 26.0346L20.9101 26.5621C20.9755 26.5964 21.0536 26.5964 21.119 26.5621L22.1241 26.0346ZM29.3952 26.338C29.4977 26.1428 29.287 25.9321 29.0917 26.0346L28.0866 26.5621C28.0212 26.5964 27.9431 26.5964 27.8777 26.5621L26.8726 26.0346C26.6774 25.9321 26.4667 26.1428 26.5691 26.338L27.0967 27.3432C27.131 27.4086 27.131 27.4867 27.0967 27.5521L26.5691 28.5572C26.4667 28.7524 26.6774 28.9631 26.8726 28.8606L27.8777 28.3331C27.9431 28.2988 28.0212 28.2988 28.0866 28.3331L29.0917 28.8606C29.287 28.9631 29.4977 28.7524 29.3952 28.5572L28.8677 27.5521C28.8334 27.4867 28.8334 27.4086 28.8677 27.3432L29.3952 26.338Z"
          fill={`url(#paint0_linear_610_14451_${token.id})`}
        />
        <defs>
          <linearGradient
            id={`paint0_linear_610_14451_${token.id}`}
            x1="24.3681"
            y1="9"
            x2="24.3681"
            y2="38.6712"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9ABFF" />
            <stop offset="1" stopColor="#B65AFF" />
          </linearGradient>
        </defs>
      </svg>
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

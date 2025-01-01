import { Modal } from "antd-mobile";
import style from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { Project } from "@/app/type";
import { httpGet } from "@/app/utils";
import { useCallback } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { shareToX } from "@/app/utils/share";
import { useMessage } from "@/app/context/messageContext";
import { mapDataToProject } from "@/app/utils/mapTo";

interface Props {
  show: boolean;
  onHide: () => void;
  token: Project;
}

export default function CreateSuccessModal({ show, onHide, token }: Props) {
  return (
    <div className={style.ModalMain}>
      <Modal
        visible={show}
        content={
          <SuccessModal
            token={token}
            onClose={() => {
              onHide();
            }}
          />
        }
        closeOnAction
        closeOnMaskClick
        onClose={() => {
          onHide();
        }}
      />
    </div>
  );
}

function SuccessModal({
  onClose,
  token
}: {
  onClose: () => void;
  token: Project;
}) {
  const { isMobile } = useUserAgent();
  const { showShare } = useMessage();
  
  const share = useCallback(async () => {
    if (token) {
      const v = await httpGet("/project?token_name=" + token.tokenName);
      if (v.code === 0) {
        const data = v.data[0];
        onClose();
        showShare(mapDataToProject(data), true)
        // shareToX(token.tokenName, "https://app.flipn.fun/detail?id=" + data.id);
      }
    }
  }, [token]);

  return (
    <div className={style.main} style={{ width: isMobile ? "80vw" : 432 }}>
      <div className={style.content}>
        <div className={style.avatar}>
          <img
            className={style.avatarImg}
            src={token.tokenIcon || token.tokenImg}
          />
        </div>

        <div className={style.nameContent}>
          <div className={style.name}>{token.tokenName}</div>
          <div className={style.ticker}>/ Ticker: {token.ticker}</div>
        </div>

        <div className={style.successText}>Created successfully!</div>

        <div className={style.successNote}>Share and get rewards!</div>

        <div className={style.btnBox}>
          <MainBtn
            onClick={async () => {
              share();
            }}
            style={{
              background: "linear-gradient(90deg, #FF2681 0%, #9514FF 100%)"
            }}
          >
            Go to Share
          </MainBtn>
        </div>
        <div className={style.heartWhite}>
          <svg
            width="83"
            height="79"
            viewBox="0 0 83 79"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_610_12183)">
              <path
                d="M18.3317 28.1753C28.4315 22.524 36.6871 27.53 39.1453 30.9673C37.9574 27.8887 37.4986 13.8377 51.7745 10.5314C66.4502 7.13248 76.5359 23.9489 71.1547 43.0028C68.7516 51.5115 65.0124 59.6797 62.6197 64.4791C61.2711 67.1842 58.4353 68.7527 55.4234 68.4971C48.7521 67.931 36.8332 66.5559 29.5898 63.5865C8.07782 54.7679 5.70688 35.2395 18.3317 28.1753Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_610_12183"
                x="0.645142"
                y="0.0914307"
                width="81.9769"
                height="78.4327"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_610_12183"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_610_12183"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        <div className={style.heartMore}>
          <svg
            width="182"
            height="72"
            viewBox="0 0 182 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M158.944 45.0579C162.433 47.3744 162.187 50.8593 161.487 52.2189C162.281 51.3275 166.728 48.8568 170.152 52.9051C173.673 57.0669 169.928 63.0935 162.905 64.5117C159.804 65.1379 156.594 65.2885 154.647 65.3144C153.514 65.3295 152.503 64.6518 152.073 63.6029C151.15 61.3501 149.647 57.3335 149.408 54.5363C148.689 46.1542 154.583 42.1623 158.944 45.0579Z"
              fill="url(#paint0_radial_86_7)"
            />
            <path
              d="M164.705 24.5606C167.512 23.4837 169.449 25.0782 169.953 26.0534C169.762 25.2177 170.167 21.5881 173.961 21.2696C177.86 20.9422 179.827 25.6412 177.734 30.3396C176.917 32.1736 175.847 33.9026 175.061 35.0735C174.429 36.0145 173.289 36.4463 172.188 36.1766C170.449 35.7506 167.856 35.0126 166.281 34.0841C161.079 31.0158 161.196 25.9067 164.705 24.5606Z"
              fill="url(#paint1_radial_86_7)"
            />
            <path
              d="M3.70536 4.56061C6.51247 3.48371 8.4486 5.07816 8.9526 6.05344C8.76183 5.21769 9.16707 1.58808 12.9605 1.26957C16.8602 0.942153 18.8271 5.64123 16.7341 10.3396C15.9172 12.1736 14.8474 13.9026 14.0608 15.0735C13.4287 16.0145 12.2887 16.4463 11.1877 16.1766C9.44881 15.7506 6.85563 15.0126 5.28131 14.0841C0.0789038 11.0158 0.196468 5.90674 3.70536 4.56061Z"
              fill="url(#paint2_radial_86_7)"
            />
            <defs>
              <radialGradient
                id="paint0_radial_86_7"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(154.5 51.0002) rotate(96.6919) scale(14.4136 16.5472)"
              >
                <stop stopColor="#FF7DC3" />
                <stop offset="1" stopColor="#FF18AA" />
              </radialGradient>
              <radialGradient
                id="paint1_radial_86_7"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(166.332 29.6335) rotate(42.1203) scale(10.3479 11.8797)"
              >
                <stop stopColor="#FF7DC3" />
                <stop offset="1" stopColor="#FF18AA" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_86_7"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(5.33197 9.63349) rotate(42.1203) scale(10.3479 11.8797)"
              >
                <stop stopColor="#FF7DC3" />
                <stop offset="1" stopColor="#FF18AA" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className={`${style.close} button`} onClick={onClose}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11 11L21 21"
            stroke="#888197"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 11L11 21"
            stroke="#888197"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="16"
            cy="16"
            r="15.25"
            stroke="#888197"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}

import style from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { Project } from "@/app/type";

import { httpGet } from "@/app/utils";
import { useCallback, useEffect } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { shareToX } from "@/app/utils/share";
import { useMessage } from "@/app/context/messageContext";
import { mapDataToProject } from "@/app/utils/mapTo";
import Modal from "@/app/components/modal";
import { useRouter } from "next/navigation";
import { numberFormatter } from "@/app/utils/common";
// @ts-ignore
import confetti from "canvas-confetti";
import { useInterval } from "ahooks";

interface Props {
  show: boolean;
  onHide: () => void;
  token: Project;
  pointByVolume: string | undefined;
  onShare: () => void;
}

export default function CreateSuccessModal({
  show,
  onHide,
  token,
  pointByVolume,
  onShare
}: Props) {
  const { isMobile } = useUserAgent();

  if (!isMobile && show) {
    return <SuccessModal
      token={token}
      pointByVolume={pointByVolume}
      onClose={() => {
        onHide();
      }}
      onShare={onShare}
    />;
  }

  return (
    <div className={style.ModalMain}>
      <Modal
        forceNoCloseIcon={true}
        open={show}
        onClose={() => {
          onHide();
        }}
      >
        <SuccessModal
          token={token}
          pointByVolume={pointByVolume}
          onClose={() => {
            onHide();
          }}
          onShare={onShare}
        />
      </Modal>
    </div>
  );
}

function SuccessModal({
  onClose,
  onShare,
  pointByVolume,
  token
}: {
  onClose: () => void;
  token: any;
  onShare: () => void;
  pointByVolume: string | undefined;
}) {
  const { isMobile } = useUserAgent();
  const router = useRouter();

  const launchConfetti = useCallback(() => {
    if (token) {
      confetti({
        particleCount: 500,
        spread: 100,
        origin: { y: 0.6, x: 0.5 },
        zIndex: 99999
      });
    }
  }, [token]);

  useInterval(() => {
    launchConfetti()
  }, 1000, { immediate: true })  

  return (
    <div className={style.main + ' ' + (isMobile ? style.mainMobile : style.mainPc)} style={{ width: isMobile ? "90vw" : 432 }}>
      <div className={style.tokenInfo}>
        <div className={style.tokenTitle}>A Genesis Token is live!</div>
        <div className={style.tokenAmount}>
          You will get
          <span className={style.tokenSymbol}> {numberFormatter(5950, 4, true)} $FUN </span>
          when this token hit bonding curve.
        </div>
      </div>

      <div className={style.content}>
        <div className={style.avatar}>
          <img
            className={style.avatarImg}
            src={token.tokenUri || token.tokenIcon || token.tokenImg}
          />
        </div>

        <div className={style.nameContent}>
          <div className={style.time}>3:00:00</div>
          <div className={style.name}>{token.tokenName}</div>
          <div className={style.ticker}>Ticker: {token.tokenSymbol}</div>
        </div>

        <div className={style.successNote}>
          Collect 100 Likes to Ticking now!
        </div>

        <div className={style.btnBox}>
          <MainBtn
            onClick={async () => {
              isMobile && onClose();
              onShare();
            }}
            style={{
              fontWeight: isMobile ? 500 : 700,
              background: isMobile ? "#000000" : "#FBCA04",
              color: isMobile ? "#FBCA04" : "#000000"
            }}
          >
            Share
          </MainBtn>
        </div>
      </div>

      <div
        className={`${style.close} button`}
        onClick={() => {
          router.push("/");
          onClose();
        }}
      >
        Back to Home
      </div>
    </div>
  );
}

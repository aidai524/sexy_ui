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

  useEffect(() => {
    if (token) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.8 },
        zIndex: 99999
      });
    }
  }, [token]);

  return (
    <div className={style.main} style={{ width: isMobile ? "90vw" : 432 }}>
      {/* <div className={style.yaowan}>
        <img className={style.yaowanImg} src="/img/share/yaowan.gif" alt="" />
      </div> */}

      <div className={style.tokenInfo}>
        <div className={style.tokenTitle}>A Genesis Token is live!</div>
        <div className={style.tokenAmount}>
          You&apos;ve got <span style={{ color: '#fff' }}>{ numberFormatter(pointByVolume as string, 4, true) }</span>{" "}
          <span className={style.tokenSymbol}>$FlipN</span>
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
              onClose();
              onShare();
            }}
            style={{
              background: "#000000",
              color: "#FBCA04"
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

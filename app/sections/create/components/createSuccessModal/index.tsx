
import style from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { Project } from "@/app/type";
import { httpGet } from "@/app/utils";
import { useCallback } from "react";
import { useUserAgent } from "@/app/context/user-agent";
import { shareToX } from "@/app/utils/share";
import { useMessage } from "@/app/context/messageContext";
import { mapDataToProject } from "@/app/utils/mapTo";
import Modal from "@/app/components/modal";

interface Props {
  show: boolean;
  onHide: () => void;
  token: Project;
}

export default function CreateSuccessModal({ show, onHide, token }: Props) {
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
            onClose={() => {
              onHide();
            }}
          />
      </Modal>
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
        showShare(mapDataToProject(data), true);
      }
    }
  }, [token]);

  return (
    <div className={style.main} style={{ width: isMobile ? "90vw" : 432 }}>
      <div className={ style.yaowan }>
        <img className={ style.yaowanImg } src="/img/share/yaowan.gif" alt="" />
      </div>

      <div className={style.tokenInfo}>
        <div className={style.tokenTitle}>A Genesis Token is live!</div>
        <div className={style.tokenAmount}>
          You've got <span>1234</span> <span className={style.tokenSymbol}>$FlipN</span>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.avatar}>
          <img
            className={style.avatarImg}
            src={token.tokenIcon || token.tokenImg}
          />
        </div>

        <div className={style.nameContent}>
          <div className={style.time}>3:00:00</div>
          <div className={style.name}>Squirrel Cheers</div>
          <div className={style.ticker}>Ticker: {token.ticker}</div>
        </div>

        <div className={style.successNote}>Collect 100 Likes to Ticking now!</div>

        <div className={style.btnBox}>
          <MainBtn
            onClick={async () => {
              share();
            }}
            style={{
              background: "#000000",
              color: "#FBCA04",
            }}
          >
            Share
          </MainBtn>
        </div>
    

      </div>

      <div className={`${style.close} button`} onClick={onClose}>
       Back to Home
      </div>
    </div>
  );
}

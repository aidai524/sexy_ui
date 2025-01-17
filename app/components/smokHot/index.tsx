import { useEffect, useMemo, useState } from "react";
import SmokPanel from "./smoke-panel";
import type { Project } from "@/app/type";
import { Modal } from "antd-mobile";
import BoostVip from "../boost/boostVip";
import { useUser } from "@/app/store/useUser";
import { useAccount } from "@/app/hooks/useAccount";
import BoostSuperNoTimes from "../boost/boostSuperNoTimes";
import { usePrepaidDelayTimeStore } from "@/app/store/usePrepaidDelayTime";
import SmokeButton from "./smoke-button";
import Big from "big.js";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { numberFormatter } from "@/app/utils/common";

interface Props {
  token: Project;
  isBigIcon?: boolean;
  id?: string;
  onClick: () => void;
  actionChildren?: React.ReactNode;
  content?: React.ReactNode;
  onHide?: () => void;
}

export default function SmokeBtn({
  onClick,
  token,
  isBigIcon = false,
  actionChildren,
  content,
  onHide,
  id
}: Props) {
  const [panelShow, setPanelShow] = useState(false);
  const [vipShow, setVipShow] = useState(false);
  const { userInfo }: any = useUser();
  const { address } = useAccount();
  const [boostSuperNoTimesShow, setBoostSuperNoTimesShow] = useState(false);
  const { prepaidDelayTime } = usePrepaidDelayTimeStore();
  const [flipNum, setFlipNum] = useState(0);

  const { getMC, pool, checkPrePayed } = useTokenTrade({
    tokenName: token?.tokenName as string,
    tokenSymbol: token?.tokenSymbol as string,
    tokenDecimals: token?.tokenDecimals as number,
    loadData: false
  });

  useEffect(() => {
    checkPrePayed().then((res) => {
      setFlipNum(res);
    })
  }, [checkPrePayed]);  
  
  const isDelay = useMemo(() => {
    if (
      prepaidDelayTime &&
      token.createdAt &&
      Date.now() - token.createdAt > prepaidDelayTime
    ) {
      return true;
    }
    return false;
  }, [prepaidDelayTime, token]);

  const isDisabled = useMemo(() => {
    return token.isSuperLike || token.account === address;
  }, [isDelay, token, address]);

  const disabledText = useMemo(() => {
    if (!isDisabled) {
      return ''
    }
    
    if (flipNum && Number(flipNum) > 0) {
      const flipNumFormatted = numberFormatter(new Big(flipNum).div(10 ** 9).div(1 - 0.015).toString(), 2, true, { isShort: true })
      return 'Fliped <br/>' + flipNumFormatted + 'SOL'
    }

    if (token.account === address) {
      return 'Flipped'
    }

    return 'Flipped'
  }, [isDelay, token, address, flipNum, isDisabled])

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

  const onButtonClick = () => {
    if (!address) {
      window.connect();
      return;
    }

    if (isDisabled) {
      return;
    }
    setPanelShow(true);
  };

  return (
    <>
      {actionChildren ? (
        <div className="button" onClick={onButtonClick}>
          {actionChildren}
        </div>
      ) : (
        <SmokeButton
          {...{ size, id, address, token, isDisabled, disabledText }}
          onClick={onButtonClick}
        />
      )}

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
    </>
  );
}

import { Modal } from "antd-mobile";
import style from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { Project, UserInfo } from "@/app/type";
import { httpGet } from "@/app/utils";
import { useCallback } from "react";
import { defaultAvatar } from "@/app/utils/config";

interface Props {
  onClose: () => void;
  token: Project;
  userInfo: UserInfo;
  type: number;
  solAmount: string;
  amount: string;
}

const typeCls = {
  0: style.buy,
  1: style.sell
} as any

const typeText = {
  0: 'bought',
  1: 'sold'
} as any


export default function TradeSuccessModal({
  onClose,
  token,
  userInfo,
  type,
  solAmount,
  amount
}: Props) {
  

  return (
    <div className={style.main}>
      <div className={style.content + ' ' + typeCls[type]}>
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
        <div className={ style.contentBox }>
          <div className={style.successText}>You’ve { typeText[type] } </div>
          <div className={style.successNote}>{ amount } { token.tokenSymbol }</div>
          <div className={style.successText}>successfully!</div>
        </div>

        <div className={ style.userIcon }>
          <img className={ style.userImg } src={ defaultAvatar }/>
        </div>

        <div className={ style.tips }>
          <span>You are expected to receive</span>
          <span className={ style.sexFi }> { Number(solAmount) / 10000 } points</span>
        </div>
      </div>

      <div className={style.close} onClick={onClose}>
        <img src="/img/home/close.svg"/>
      </div>
    </div>
  );
}

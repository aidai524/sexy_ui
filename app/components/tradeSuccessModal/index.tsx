import { Modal } from "antd-mobile";
import style from "./index.module.css";
import MainBtn from "@/app/components/mainBtn";
import type { Project, UserInfo } from "@/app/type";
import { httpGet } from "@/app/utils";
import { useCallback } from "react";

interface Props {
  onClose: () => void;
  token: Project;
  userInfo: UserInfo;
  type: number;
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
          <img className={ style.userImg } src={ userInfo.icon }/>
        </div>

        <div className={ style.tips }>
          <span>You’ve got</span>
          <span className={ style.sexFi }>1234 $SEXYFI </span>
        </div>
        
      </div>

      <div className={style.close} onClick={onClose}>
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

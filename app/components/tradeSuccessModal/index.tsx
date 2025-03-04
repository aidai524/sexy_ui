import style from "./index.module.css";
import type { Project, UserInfo } from "@/app/type";
import { defaultAvatar } from "@/app/utils/config";
import { numberFormatter } from "@/app/utils/common";
import { formatNumberWithCommas } from "@/app/utils";

interface Props {
  onClose: () => void;
  token: Project;
  userInfo: UserInfo;
  type: number;
  solAmount: string;
  amount: string;
  point: string;
}

const typeCls = {
  0: style.buy,
  1: style.sell
} as any;

const typeText = {
  0: "bought",
  1: "sold"
} as any;

export default function TradeSuccessModal({
  onClose,
  token,
  userInfo,
  type,
  solAmount,
  amount,
  point
}: Props) {
  return (
    <div className={style.main}>
      <div className={style.content + " " + typeCls[type]}>
        <div className={style.avatar}>
          <img
            className={style.avatarImg}
            src={
              token.tokenIcon || token.tokenImg || "/img/token-placeholder.png"
            }
          />
        </div>

        <div className={`${style.nameContent}`}>
          <span
            className={`${style.name} text-overflow`}
            style={{ width: "50%" }}
          >
            {token.tokenName}
          </span>
          <span className="text-overflow" style={{ width: "50%" }}>
            / Ticker: {token.ticker}
          </span>
        </div>
        <div className={style.contentBox}>
          <div className={style.successText}>You’ve {typeText[type]} </div>
          <div className={style.successNote}>
            {formatNumberWithCommas(amount)} {token.tokenSymbol}
          </div>
          <div className={style.successText}>successfully!</div>
        </div>

        <div className={style.userIcon}>
          <img className={style.userImg} src="/img/home/default-flipn.png" />
        </div>

        <div className={style.tips}>
          <span>{"You’ve got"}</span>
          <span className={style.sexFi}>
            {" "}
            {numberFormatter(point, 6, true, {
              isShort: true
            })}{" "}
            $FUN
          </span>
        </div>
      </div>

      <div className={style.close} onClick={onClose}>
        <svg
          width="55"
          height="51"
          viewBox="0 0 55 51"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48.8069 17.1506L13.7846 6.85943L14.915 11.564L11.4147 14.9143L12.3431 18.6595L9.46321 21.5474L10.7878 25.409L7.5117 28.1805L9.55875 31.482L5.97848 33.3918L41.0008 43.683L38.6093 40.1551L42.9171 37.1697L41.1812 33.0596L45.0778 29.8257L42.7365 26.3101L46.8201 23.9035L44.618 18.884L48.8069 17.1506Z"
            fill="#A9A5EA"
            fillOpacity="0.8"
            stroke="black"
            strokeLinejoin="round"
          />
          <path
            d="M35.69 20.5209C35.69 20.5209 20.3832 32.075 18.8934 26.9214M22.6558 16.6714C24.511 17.6522 29.9842 28.7396 32.9236 34.5177"
            stroke="black"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

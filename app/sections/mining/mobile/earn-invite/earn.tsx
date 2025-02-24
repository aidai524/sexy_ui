import styles from "./index.module.css";
import Link from "next/link";
import { useUserAgent } from "@/app/context/user-agent";
import clsx from 'clsx';

interface EarnProps {
  info: {
    like_num?: number;
    remaining_like_num?: number;
  };
  className?: string;
}

export const Earn = ({ info, className }: EarnProps) => {
  const { isMobile } = useUserAgent();

  return (
    <div
      className={styles.Item}
      style={{
        border: "1px solid #ffa8e8",
        width: isMobile ? "calc(50vw - 21px)" : '',
        height: isMobile ? 142 : 165
      }}
    >
      <div
        className={styles.ItemBg}
        style={{
          background:
            "radial-gradient(74.25% 66.17% at 63.1% 125%, rgba(171, 40, 64, 0.8) 0%, rgba(12, 1, 6, 0.8) 100%)"
        }}
      />
      <div className={styles.ItemContent}>
        <div className={isMobile ? styles.Title : styles.TitleLaptop}>
          <div>Like to Earn</div>
          {
            !isMobile && (
              <img src="/img/mining/icon-info.svg" alt="" className={styles.TitleIcon} />
            )
          }
        </div>
        <div className={isMobile ? styles.Desc: styles.DescLaptop}>
          {info?.like_num || 100} likes per {!isMobile && <br />} day
        </div>
        <div
          className={styles.Num}
          style={{
            height: isMobile ? 24 : 27
          }}
        >
          {info?.remaining_like_num || 100} left
        </div>
        <Link className={styles.Button} href="/">
          View Memes
        </Link>
      </div>
    </div>
  );
};

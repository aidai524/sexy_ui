import styles from "./index.module.css";
import { useHomeTab } from "@/app/store/useHomeTab";
import { useAuth } from "@/app/context/auth";
import { useMemo } from "react";
import { useUserAgent } from "@/app/context/user-agent";

export default function LikeToEarn() {
  const homeTabStore: any = useHomeTab();
  const { userInfo } = useAuth();
  const remainingNum = useMemo(
    () => userInfo?.like_num - userInfo?.using_like_num,
    [userInfo]
  );
  const { isMobile } = useUserAgent();
  if (homeTabStore.homeTabIndex === 0)
    return (
      <div
        className={`${styles.Container} ${styles.All}`}
        onClick={() => {
          homeTabStore.set({
            homeTabIndex: 1
          });
        }}
        style={{
          top: isMobile ? 100 : 20
        }}
      >
        <div>
          <div className={styles.Like}>
            <Heart />
            <div>{remainingNum || 100} left today</div>
          </div>
          <div className={styles.Desc}>Like to Earn</div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            d="M1 1.5L6.5 7L1 12.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7.5 1.5L13 7L7.5 12.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );

  if (homeTabStore.homeTabIndex === 1)
    return (
      <div
        className={`${styles.Container} ${styles.Genesis}`}
        style={{
          top: isMobile ? 100 : 20
        }}
      >
        <div className={styles.Like}>
          <Heart />
          <div>{remainingNum || 100} left today</div>
        </div>
      </div>
    );

  return null;
}

const Heart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="14"
    viewBox="0 0 16 14"
    fill="none"
  >
    <path
      d="M0.143762 3.15655C-1.0621 8.06162 5.64645 13.1969 8.00475 14C11.9352 12.3937 16.8806 7.28318 15.8657 3.15647C14.6717 -1.69879 9.77347 -0.0565568 8.00475 2.15225C6.8256 0.144131 1.33738 -1.6987 0.143762 3.15655Z"
      fill="#FF2681"
    />
  </svg>
);

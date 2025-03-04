"use client";

import styles from "./layout.module.css";
import useNotice from "../../../hooks/use-notice";
import Tabs from "./tabs";
import Refer from '@/app/components/layout/laptop/user/refer';
import { useAuth } from '@/app/context/auth';

export default function Component({ children }: any) {
  useNotice();
  const { userInfo } = useAuth();

  return (
    <div className={styles.Main} id="main-content">
      {children}
      <Refer userInfo={userInfo} isMobile />
      <Tabs />
      {/* {isRefer && <ReferContentCard />} */}
    </div>
  );
}

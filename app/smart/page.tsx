"use client";
import TopTraders from "@/app/sections/trends/components/top-traders";
import PageHeader from "@/app/components/page-header/mobile";
import CardContainer from "@/app/sections/smart/components/cardContainer";
import styles from './index.module.css';
import { useUserAgent } from "@/app/context/user-agent";
import { SHOW_COPY_TRADE } from "@/app/utils/config";


export default function Create() {
  const { isMobile } = useUserAgent();
  if (!SHOW_COPY_TRADE) {
    return null
  }
  return (
    <div className={!isMobile ? styles.containerPC : styles.container}>
      {
        isMobile &&  <PageHeader
        title="Top Traders"
        theme="light"
        from="smart"
        style={{
          background: "#000"
        }}
      />
      }
      {/* card container */}
      <CardContainer />
    <TopTraders />

    </div>
  );
}

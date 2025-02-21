"use client";
import TopTraders from "@/app/sections/trends/components/top-traders";
import PageHeader from "@/app/components/page-header/mobile";
import CardContainer from "@/app/sections/smart/components/cardContainer";
import styles from './index.module.css';

export default function Create() {
  return (
    <>
    <div className={styles.container}>
      <PageHeader
        title="Top Traders"
        theme="light"
        from="smart"
        style={{
          background: "#000"
        }}
      />
      {/* card container */}
      <CardContainer />
    </div>
    <TopTraders />
    </>
  );
}

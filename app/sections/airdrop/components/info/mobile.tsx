import styles from "./index.module.css";
import AirdropHeader from '@/app/sections/airdrop/components/header';
import React from 'react';
import AirdropInfoContent from '@/app/sections/airdrop/components/info/content';

const AirdropInfoMobile = (props: any) => {
  const { } = props;

  return (
    <div className={styles.AirdropInfoContainer}>
      <AirdropHeader />
      <AirdropInfoContent />
    </div>
  );
};

export default AirdropInfoMobile;

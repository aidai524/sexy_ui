'use client';

import { useUserAgent } from '@/app/context/user-agent';
import AirdropMobile from '@/app/sections/airdrop/mobile';
import AirdropLaptop from '@/app/sections/airdrop/laptop';

const AirdropView = () => {
  const { isMobile } = useUserAgent();

  return isMobile ? (
    <AirdropMobile />
  ) : (
    <AirdropLaptop />
  );
};

export default AirdropView;

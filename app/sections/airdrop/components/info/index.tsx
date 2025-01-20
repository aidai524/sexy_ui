import { useUserAgent } from '@/app/context/user-agent';
import AirdropInfoMobile from '@/app/sections/airdrop/components/info/mobile';
import AirdropInfoLaptop from '@/app/sections/airdrop/components/info/laptop';

const AirdropInfo = () => {
  const { isMobile } = useUserAgent();

  return isMobile ? (
    <AirdropInfoMobile />
  ) : (
    <AirdropInfoLaptop />
  );
};

export default AirdropInfo;

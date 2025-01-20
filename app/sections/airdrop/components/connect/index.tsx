import { useUserAgent } from '@/app/context/user-agent';
import AirdropConnectMobile from '@/app/sections/airdrop/components/connect/mobile';
import AirdropConnectLaptop from '@/app/sections/airdrop/components/connect/laptop';

const AirdropConnect = () => {
  const { isMobile } = useUserAgent();

  return isMobile ? (
    <AirdropConnectMobile />
  ) : (
    <AirdropConnectLaptop />
  );
};

export default AirdropConnect;

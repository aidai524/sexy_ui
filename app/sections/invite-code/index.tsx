'use client';

import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import InviteCodeConnectWallet from '@/app/sections/invite-code/components/connetct-wallet';
import Social from '@/app/sections/invite-code/components/social';
import InviteCodeForm from '@/app/sections/invite-code/components/form';
import { useAccount } from '@/app/hooks/useAccount';
import { useAuth } from '@/app/context/auth';
import { useDebounceFn } from 'ahooks';
import { useRouter } from 'next/navigation';
import { useAirdropContext } from '@/app/context/airdrop';
import { useUserAgent } from '@/app/context/user-agent';

const InviteCodeView: React.FC<any> = (props) => {
  const { address } = useAccount();
  const { accountRefresher } = useAuth();
  const router = useRouter();
  const { airdropDataLoading, airdropUserData } = useAirdropContext();
  const { isMobile } = useUserAgent();

  const [pageLoading, setPageLoading] = useState(true);

  const { run: setPageLoadingDelay, cancel: setPageLoadingDelayCancel } = useDebounceFn(() => {
    setPageLoading(false);
  }, { wait: 300 });

  useEffect(() => {
    setPageLoadingDelayCancel();
    if (!address || !accountRefresher) {
      setPageLoadingDelay();
      return;
    }
    setPageLoading(false);
  }, [address, accountRefresher]);

  useEffect(() => {
    if (!!airdropUserData?.ReferralAccount) {
      router.replace('/');
    }
  }, [airdropUserData]);

  return (
    <div className={isMobile ? styles.inviteCodeContainer : styles.inviteCodeContainerLaptop}>
      {
       !pageLoading && (
          (!address || !accountRefresher || airdropDataLoading || !!airdropUserData?.ReferralAccount) ? (
            <InviteCodeConnectWallet loading={pageLoading || airdropDataLoading} />
          ) : (
            <InviteCodeForm />
          )
        )
      }
      <Social />
    </div>
  );
};

export default InviteCodeView;

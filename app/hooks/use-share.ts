import Cookies from 'js-cookie';
import { httpAuthGet } from '@/app/utils/';
import { useEffect } from 'react';
import { useAccount } from './useAccount';

export function useShare() {
  const { address } = useAccount();

  const reportReferral = async () => {
    const project = Cookies.get('referral_upload_project');
    const user = Cookies.get('referral_upload_user');

    // if (project && user) {
    //   try {
    //     const v = await httpAuthGet('/project/share', { project, address: user });
    //     if (v.code === 0) {
    //       Cookies.remove('referral_upload_project');
    //       Cookies.remove('referral_upload_user');
    //     }
    //   } catch (err) {
    //     console.error('Failed to report referral:', err);
    //   }
    // }
  };

  useEffect(() => {
    if (address) {
      reportReferral();
    }
  }, [address]);
}
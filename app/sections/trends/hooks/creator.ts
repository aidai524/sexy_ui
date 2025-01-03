import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/auth';

export function useCreator() {
  const router = useRouter();
  const { userInfo } = useAuth();

  const onClick = (address?: string) => {
    if (!address) return;
    if (address !== userInfo?.address) {
      router.push(`/profile/user?account=${address}&from=trends`);
    }
  };

  return {
    onClick,
  };
}

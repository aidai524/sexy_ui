import styles from "./index.module.css";
import { useUserAgent } from "@/app/context/user-agent";
import clsx from 'clsx';
import { Earn } from './earn';
import { Invite } from './invite';

interface EarnAndInviteProps {
  info: any;
  rate: number;
  rateLoading?: boolean;
  className?: string;
}

export default function EarnAndInvite({
  info,
  rate,
  rateLoading,
  className
}: EarnAndInviteProps) {
  const { isMobile } = useUserAgent();

  return (
    <div
      className={clsx(styles.Container, className)}
      style={{
        gap: isMobile ? 14 : 24
      }}
    >
      <Earn info={info} />
      <Invite rate={rate} />
    </div>
  );
}
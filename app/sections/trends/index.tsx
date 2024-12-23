'use client';

import { useUserAgent } from '@/app/context/user-agent';
import Mobile from './mobile';
import Laptop from './laptop';

export default function Trends() {
  const { isMobile } = useUserAgent();

  return isMobile ? <Mobile /> : <Laptop />;
}

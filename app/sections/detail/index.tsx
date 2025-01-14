"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";
import { useSearchParams } from 'next/navigation';

export default memo(function Detail(props: any) {
  const { isMobile } = useUserAgent();
  const search = useSearchParams();
  const from = search.get('from');

  return isMobile ? <div style={{ overflow: 'auto', height: '100vh' }}><Mobile {...props} from={from} /></div> : <Laptop {...props} from={from} />;
});

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


  return isMobile ? <Mobile {...props} from={from} /> : <Laptop {...props} from={from} />;
});

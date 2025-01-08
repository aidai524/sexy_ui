import Mobile from "./mobile";
import Laptop from "./laptop";
import { useUserAgent } from "@/app/context/user-agent";

export default function Tab(props: any) {
  const { isMobile } = useUserAgent();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

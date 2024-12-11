import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile";
import Laptop from "./laptop";

export default function ConnectButton(props: any) {
  const { isMobile } = useUserAgent();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

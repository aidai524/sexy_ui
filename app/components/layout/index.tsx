import { useUserAgent } from "@/app/context/user-agent";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";

export default function Layout(props: any) {
  const { isMobile } = useUserAgent();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

import useIsMobile from "@/app/hooks/useIsMobile";
import Mobile from "./mobile";
import Laptop from "./laptop";

export default function ConnectButton(props: any) {
  const isMobile = useIsMobile();

  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

import useIsMobile from "@/app/hooks/useIsMobile";
import Mobile from "./mobile/Layout";
import Laptop from "./laptop";

export default function Layout(props: any) {
  const isMobile = useIsMobile();
  return isMobile ? <Mobile {...props} /> : <Laptop {...props} />;
}

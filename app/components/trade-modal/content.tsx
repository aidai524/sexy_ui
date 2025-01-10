import Trade from "@/app/components/trade";
import { useUserAgent } from "@/app/context/user-agent";
import styles from "./content.module.css";

export default function Content({ onClose, data, initType, show }: any) {
  const { isMobile } = useUserAgent();
  return (
    <div>
      <Trade initType={initType} token={data} onClose={onClose} show={show} />
    </div>
  );
}

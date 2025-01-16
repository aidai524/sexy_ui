import { useUserAgent } from "@/app/context/user-agent";
import ModalClose from "@/app/components/icons/modal-close";
import Info from "@/app/sections/detail/components/info/detail";
import Image from "next/image";
import styles from "./index.module.css";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
export default function DetailPanel({ token, onClose }: any) {
  const { innerHeight } = useUserAgent();
  const mc = useMcWithPump(token);
  return (
    <div
      className={styles.Container}
      style={{
        height: innerHeight
      }}
    >
      <div className={styles.Header}>
        <Image
          src="/img/titles/details-title.png"
          width={112}
          height={68}
          alt="Details"
        />
        <button className="button" onClick={onClose}>
          <ModalClose size={34} />
        </button>
      </div>
      <div className={styles.Content}>
        <Info mc={mc} data={token} showHodler={false} onUpdate={() => {}} />
      </div>
    </div>
  );
}

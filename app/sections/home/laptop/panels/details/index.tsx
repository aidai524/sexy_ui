import Info from "@/app/sections/detail/components/desc";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import styles from "./index.module.css";

export default function Details({ token }: any) {
  const mc = useMcWithPump(token);
  return (
    <div className={styles.Container}>
      <Info mc={mc} data={token} from="panel" />
    </div>
  );
}

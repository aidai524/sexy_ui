import Info from "@/app/sections/detail/components/desc";
import Summary from "@/app/sections/detail/components/info/summary";
import PrelaunchStatus from "@/app/sections/detail/components/info/status/prelaunch";
import useMcWithPump from "@/app/hooks/use-mc-with-pump";
import styles from "./index.module.css";

export default function Details({ token }: any) {
  const mc = useMcWithPump(token);
  return (
    <div className={styles.Container}>
      <Summary data={token} showAddress={!!token.address} from="panel" />
      {token.status === 0 && (
        <PrelaunchStatus
          data={token}
          showAddress={!!token.address}
          from="panel"
        />
      )}
      <Info mc={mc} data={token} from="panel" />
    </div>
  );
}

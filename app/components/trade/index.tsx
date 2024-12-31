import styles from "./trande.module.css";
import BuySell from "./buySell";
import BuySellLaunched from "./buySellLaunched";
import BuySellPump from "./buySellPump";
import type { Project } from "@/app/type";

interface Props {
  token: Project;
  initType?: string;
  from?: string;
  onClose?: () => void;
}

export default function Trade({
  token,
  initType = "buy",
  from,
  onClose
}: Props) {
  console.log('token:', token)

  return (
    <div className={styles.main}>
      {
        token.status === 1 && token.DApp === 'pump' && <BuySellPump
          token={token}
          initType={initType}
          from={from}
          onClose={() => {
            onClose && onClose();
          }}
        />
      }
      {
        token.status === 1 && token.DApp === 'sexy' && <BuySell
          token={token}
          initType={initType}
          from={from}
          onClose={() => {
            onClose && onClose();
          }}
        />
      }
      {
        token.status === 2 && <BuySellLaunched
          token={token}
          initType={initType}
          from={from}
          onClose={() => {
            onClose && onClose();
          }}
        />
      }

    </div>
  );
}

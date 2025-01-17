import { useVip } from "@/app/hooks/useVip";
import styles from "./boost.module.css";
import { BoostIcon } from "./boostIocn";
import { fail, success } from "@/app/utils/toast";
import MainBtn from "../mainBtn";
import { useState } from "react";
import { httpAuthPost } from "@/app/utils";
import type { Project } from "@/app/type";

interface Props {
  onBoost: () => void;
  boostNum?: number | undefined;
  usingBoostNum?: number | undefined;
  token: Project;
}

export default function BoostJust({
  onBoost,
  boostNum,
  usingBoostNum,
  token
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function boost() {
    const val = await httpAuthPost("/project/boost?id=" + token.id);
    if (val.code === 0) {
      success("Boost success");
      onBoost && onBoost();
    } else {
      fail("Boost fail");
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.boostInit}>
        <div className={styles.initTipContent}>
          <BoostIcon />
          <div className={styles.initTitle}>Boost</div>
          <div className={styles.initAmount}>
            {usingBoostNum}/{boostNum}
          </div>
          <div className={styles.initTip}>
            Boost allows the MEME exposure up to 8.5x in FlipN for 30 minutes.
            VIP users will have 4 chances per day to boost MEMEs.
          </div>
        </div>
      </div>

      <MainBtn
        isLoading={isLoading}
        onClick={async () => {
          try {
            setIsLoading(true);
            if (
              typeof usingBoostNum !== "undefined" &&
              boostNum &&
              boostNum - usingBoostNum > 0
            ) {
              await boost();
            }
            onBoost();
            setIsLoading(false);
          } catch (e) {
            console.log(e);
            setIsLoading(false);
            fail("Transition fail");
          }
        }}
        style={{ marginTop: 10 }}
      >
        Boost Now
      </MainBtn>
    </div>
  );
}

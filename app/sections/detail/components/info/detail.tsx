import styles from "./detail.module.css";
import InfoPart from "./infoPart";
import type { Project } from "@/app/type";

interface Props {
  data: Project;
  mc?: string | number;
  showHodler?: boolean;
  showAddress?: boolean;
  onUpdate: (type?: string) => void;
}

export default function Info({
  data,
  mc,
  onUpdate,
  showHodler = true,
  showAddress = true,
  ...rest
}: Props) {
  return (
    <div className={!data ? styles.mainEmpty : styles.main}>
      <InfoPart
        showLikes={true}
        mc={mc}
        data={data}
        theme="light"
        showHolders={showHodler}
        showAddress={showAddress}
        {...rest}
      />
    </div>
  );
}

import styles from "./index.module.css";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/app/components/popover";
export default function TipsButton({ tips, children }: any) {
  return tips ? (
    <Popover
      content={<div className={styles.Tips}>{tips}</div>}
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Left}
    >
      {children}
    </Popover>
  ) : (
    children
  );
}

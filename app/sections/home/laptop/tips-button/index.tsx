import styles from "./index.module.css";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/app/components/popover";
export default function TipsButton({ tips, children, triggerStyle }: any) {
  return tips ? (
    <Popover
      content={<div className={styles.Tips}>{tips}</div>}
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Left}
      closeDelayDuration={0}
      triggerContainerStyle={triggerStyle}
    >
      {children}
    </Popover>
  ) : (
    children
  );
}

import { Button, SpinLoading } from "antd-mobile";

export default function MainBtn({
  children,
  onClick,
  style,
  isLoading = false,
  isDisabled = false
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: any;
}) {
  return (
    <Button
      loadingIcon={
        <SpinLoading
          color={"#fff"}
          style={{ "--size": "24px", marginRight: 10 }}
        />
      }
      loadingText={children as any}
      disabled={isDisabled}
      loading={isLoading}
      style={style}
      onClick={onClick}
      className="main-btn button"
    >
      {children}
    </Button>
  );
}

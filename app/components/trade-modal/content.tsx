import Trade from "@/app/components/trade";

export default function Content({
  onClose,
  data,
  initType,
  show,
  onSuccess
}: any) {
  return (
    <Trade
      initType={initType}
      token={data}
      onClose={onClose}
      show={show}
      onSuccess={onSuccess}
    />
  );
}

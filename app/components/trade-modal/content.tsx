import Trade from "@/app/components/trade";

export default function Content({ onClose, data, initType, show }: any) {
  return (
    <Trade initType={initType} token={data} onClose={onClose} show={show} />
  );
}

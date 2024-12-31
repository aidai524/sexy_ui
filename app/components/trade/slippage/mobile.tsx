import { Popup } from "antd-mobile";
import Content from "./content";

interface Props {
  show: boolean;
  token: any;
  slipData?: number | string;
  onSlipDataChange?: (val: any) => void;
  onHide?: () => void;
}

export default function Mobile({
  show,
  token,
  slipData,
  onSlipDataChange,
  onHide
}: Props) {
  // const [inputData, setInputData] = useState(slipData)

  return (
    <Popup
      visible={show}
      onMaskClick={() => {
        onHide && onHide();
      }}
      onClose={() => {
        onHide && onHide();
      }}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <Content
        {...{
          onHide,
          token,
          slipData,
          onSlipDataChange,
          isMobile: true
        }}
      />
    </Popup>
  );
}

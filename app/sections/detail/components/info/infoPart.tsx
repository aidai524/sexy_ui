import type { Project } from "@/app/type";
import Empty from "@/app/components/empty";
import Summary from "./summary";
import PrelaunchStatus from "./status/prelaunch";
import LaunchesStatus from "./status/launches";

interface Props {
  data: Project;
  specialTime?: string;
  showLikes?: boolean;
  showProgress?: boolean;
  showHolders?: boolean;
  showAddress?: boolean;
  showMedia?: boolean;
  theme?: string;
  mc?: string | number;
  withoutFlip?: boolean;
}

export default function InfoPart({ data, showAddress = true }: Props) {
  if (!data) {
    return <Empty text="No info" />;
  }

  return (
    <div>
      <Summary data={data} showAddress={showAddress} />
      {data.status === 0 && <PrelaunchStatus {...{ data, showAddress }} />}
      {data.status !== 0 && <LaunchesStatus {...{ data }} />}
    </div>
  );
}

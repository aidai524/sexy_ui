import InfoPart from "../../detail/components/info/infoPart";
export default function Mobile({ newData }: any) {
  return (
    <InfoPart
      showLikes={false}
      specialTime={"just now"}
      data={newData}
      theme="light"
      showHolders={false}
      showProgress={false}
      withoutFlip={true}
    />
  );
}

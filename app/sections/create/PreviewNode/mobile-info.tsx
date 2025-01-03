import InfoPart from "../../detail/components/info/infoPart";
export default function Mobile({ newData }: any) {
  return (
    <InfoPart
      showLikes={false}
      specialTime={"just now"}
      showBackIcon={false}
      showThumbnailHead={true}
      showThumbnailProgress={false}
      data={newData}
      theme="light"
      withoutFlip={true}
    />
  );
}

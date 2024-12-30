import TokenCard from "../../home/laptop/main/token-card";
import PanelWrapper from "../../home/laptop/main/token/panel-wrapper";
import styles from "../../home/laptop/main/token/index.module.css";
import InfoPart from "@/app/sections/detail/components/info/infoPart";
export default function LaptopInfo({ newData }: any) {
  return (
    <>
      <div
        className={styles.Flip}
        style={{
          left: -24,
          bottom: -20
        }}
      />
      <div
        className={styles.Container}
        style={{
          display: "flex",
          gap: "16px",
          paddingTop: 16,
          height: "calc(100vh - 288px)"
        }}
      >
        <TokenCard token={newData} />
        <PanelWrapper>
          <InfoPart
            showLikes={false}
            specialTime={"just now"}
            showBackIcon={false}
            showThumbnailProgress={false}
            data={newData}
            theme="light"
            sepSize={2}
            showThumbnailHead={false}
            showTop={false}
          />
          <div style={{ height: 2 }} />
        </PanelWrapper>
      </div>
    </>
  );
}

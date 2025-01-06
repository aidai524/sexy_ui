import styles from "./index.module.css";
import HottestItem from "@/app/sections/trends/components/hottest/item";
import Empty from "@/app/components/empty";
import TrendsLoading from "@/app/sections/trends/components/loading";

const Hottest = (props: any) => {
  const { data, onBuy, loading } = props;

  return (
    <div className={styles.Container}>
      <div className={styles.Title}>The hottest</div>
      <div className={styles.List}>
        {!loading &&
          data.length > 0 &&
          data.map((it: any, idx: number) => (
            <HottestItem key={idx} index={idx} trend={it} onBuy={onBuy} />
          ))}
      </div>
      {loading && <TrendsLoading />}
      {!loading && data.length <= 0 && (
        <Empty
          text="No Data"
          textStyle={{
            fontSize: 12,
            fontWeight: 300,
            color: "#9290B1"
          }}
        />
      )}
    </div>
  );
};

export default Hottest;

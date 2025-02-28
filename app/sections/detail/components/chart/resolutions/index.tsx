import styles from "./index.module.css";

const TABS = [
  {
    value: 1,
    label: "1 min"
  },
  {
    value: 5,
    label: "5 min"
  },
  {
    value: 15,
    label: "15 min"
  }
];
export default function Resolutions({ currentTab, onChange }: any) {
  return (
    <div className={styles.Container}>
      {TABS.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.Item} button`}
          style={{
            opacity: currentTab === tab.value ? 1 : 0.5
          }}
          onClick={() => {
            onChange(tab.value);
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

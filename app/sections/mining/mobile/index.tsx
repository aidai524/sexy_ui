import Content from "../content";
import PageHeader from "@/app/components/page-header/mobile";
import styles from "./index.module.css";

export default function Mining(props: any) {
  return (
    <div>
      <PageHeader title="Reward" />
      {/* <Content styles={styles} isMobile={true} {...props} /> */}
      {/* <a className={`button ${styles.Gitbook}`}>
        <Gitbook />
      </a> */}
    </div>
  );
}

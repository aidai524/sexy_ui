import Content from "./content";
import Gitbook from "@/app/components/icons/gitbook";
import styles from "./ming.module.css";

export default function Mining(props: any) {
  return (
    <>
      <Content styles={styles} isMobile={true} {...props} />
      {/* <a className={`button ${styles.Gitbook}`}>
        <Gitbook />
      </a> */}
    </>
  );
}

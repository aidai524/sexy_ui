import Content from "./content";
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

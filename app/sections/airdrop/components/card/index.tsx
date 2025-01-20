import styles from "./index.module.css";

const AirdropCard = (props: any) => {
  const { children, className, style } = props;

  return (
    <div className={[styles.AirdropCardContainer, className || ''].join(' ')} style={style}>
      {children}
    </div>
  );
};

export default AirdropCard;

import styles from "./index.module.css";
export default function Vip({ userInfo, address, onVipShow }: any) {
  return (
    <div
      className={styles.vipImg}
      onClick={() => {
        if (userInfo.address === address) {
          onVipShow && onVipShow();
        }
      }}
    >
      {Date.now() < userInfo.vipExpirationTime ? (
        <img style={{ width: 52 }} src="/img/profile/vip.png" />
      ) : (
        <img style={{ width: 52 }} src="/img/profile/no-vip.png" />
      )}
    </div>
  );
}

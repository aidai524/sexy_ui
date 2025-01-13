import styles from "./index.module.css";
import { WalletModalButton } from "@/app/libs/solana/wallet-adapter/modal";
import LoginIcon from "./login-icon";
import RankPanel from "../../component/rank";
import RankHeader from "../../component/rank/header";
import { useAuth } from "@/app/context/auth";
import { Popup } from "antd-mobile";
import { useState } from "react";

export default function Rank({ info, infoLoading }: any) {
  const { userInfo } = useAuth();
  const [visible, setVisible] = useState(false);
  return (
    <>
      {userInfo?.address ? (
        <div className={styles.RankWrapper}>
          <RankHeader
            rank={info?.your_rank}
            onClick={() => {
              setVisible(true);
            }}
          />
        </div>
      ) : (
        <div className={styles.ConnectContainer}>
          <WalletModalButton className={styles.ConnectWallet}>
            Connect wallet
          </WalletModalButton>
          <span>and get start!</span>
          <LoginIcon className={styles.ConnectIcon} />
        </div>
      )}
      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px"
        }}
      >
        <RankPanel
          rank={info?.your_rank}
          list={info?.mining_rank}
          loading={infoLoading}
        />
      </Popup>
    </>
  );
}

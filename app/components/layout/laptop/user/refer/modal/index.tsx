import styles from "./index.module.css";
import { useReferStore } from "@/app/store/useRefer";
import Modal from "@/app/components/modal";
import { fail, success } from "@/app/utils/toast";
import { useAccount } from "@/app/hooks/useAccount";
import { useGuidingTour } from "@/app/store/use-guiding-tour";
import { Popup } from "antd-mobile";

const ReferModal = (props: any) => {
  const { isMobile } = props;
  const store = useReferStore();
  const { hasShownTour } = useGuidingTour();

  const handleClose = () => {
    store.setVisible(false);
  };

  return isMobile ? (
    <Popup
      visible={store.visible}
      onMaskClick={handleClose}
      onClose={handleClose}
      bodyStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px"
      }}
    >
      <ReferModalContent {...props} />
    </Popup>
  ) : (
    <Modal
      open={store.visible && hasShownTour}
      onClose={handleClose}
      style={{}}
      mainStyle={{
        border: 0
      }}
    >
      <ReferModalContent {...props} />
    </Modal>
  );
};

export default ReferModal;

const ReferModalContent = (props: any) => {
  const { userInfo, isMobile } = props;
  const { address } = useAccount();

  const handleCopy = () => {
    const shareLink = new URL(window?.location?.origin);
    shareLink.searchParams.set("code", address ?? "");
    navigator.clipboard
      .writeText(shareLink.toString())
      .then(() => {
        success("Copied share link!");
      })
      .catch((err) => {
        fail("Copy failed!");
      });
  };

  return (
    <div className={isMobile ? styles.ContainerMobile : styles.Container}>
      <div className={isMobile ? styles.TitleMobile : styles.Title}>
        Referral Earning
      </div>
      <div className={isMobile ? styles.ContentMobile : styles.Content}>
        <div className={isMobile ? styles.EarnedMobile : styles.Earned}>
          <div
            className={isMobile ? styles.EarnedTitleMobile : styles.EarnedTitle}
          >
            <div className={styles.EarnedTitleText}>EARNED</div>
            <div
              className={
                isMobile
                  ? styles.EarnedTitleValueMobile
                  : styles.EarnedTitleValue
              }
            >
              {userInfo?.referralFee || 0} SOL
            </div>
          </div>
          <div className={isMobile ? styles.ProgressMobile : styles.Progress}>
            <div className={styles.ProgressValue} style={{ width: "25%" }} />
            <div className={styles.NodeList}>
              <div className={styles.NodeActive}>
                <div className={styles.NodeLabel}>Vol.50k</div>
                <div className={styles.NodeReward}>
                  <div className={styles.NodeRewardLabel}>Earn Rewards</div>
                  <div className={styles.NodeRewardContent}>
                    <div className={styles.NodeRewardValue}>0.4 SOL</div>
                    <div className={styles.NodeRewardUnit}>/month</div>
                  </div>
                </div>
              </div>
              <div className={styles.Node}>
                <div className={styles.NodeLabel}>Vol.250k</div>
              </div>
              <div className={styles.Node}>
                <div className={styles.NodeLabel}>Vol.500k</div>
                <div className={styles.NodeReward}>
                  <div className={styles.NodeRewardLabel}>Earn Rewards</div>
                  <div className={styles.NodeRewardContent}>
                    <div className={styles.NodeRewardValue}>0.8 SOL</div>
                    <div className={styles.NodeRewardUnit}>/month</div>
                  </div>
                </div>
              </div>
              <div className={styles.Node}>
                <div className={styles.NodeLabel}>Vol.1000k</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.Invite}>
          <div className={styles.InviteText}>
            Invite Friends and Earn Commissions Get up {!isMobile && <br />} to{" "}
            <strong className={styles.InviteTextPrimary}>$5000</strong> rebates
          </div>
          <button
            type="button"
            className={styles.InviteBtn}
            onClick={handleCopy}
          >
            Invite now
          </button>
        </div>
      </div>
    </div>
  );
};

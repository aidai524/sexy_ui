import styles from './index.module.css';
import { useReferStore } from '@/app/store/useRefer';
import Modal from '@/app/components/modal';
import { fail, success } from '@/app/utils/toast';
import { useAccount } from '@/app/hooks/useAccount';

const ReferModal = (props: any) => {
  const { userInfo } = props;
  const store = useReferStore();
  const { address } = useAccount();

  const handleClose = () => {
    store.setVisible(false);
  };

  const handleCopy = () => {
    const shareLink = new URL(window?.location?.origin);
    shareLink.searchParams.set('code', address ?? '');
    navigator.clipboard.writeText(shareLink.toString())
      .then(() => {
        success('Copied share link!');
      })
      .catch(err => {
        fail('Copy failed!');
      });
  };

  return (
    <Modal
      open={store.visible}
      onClose={handleClose}
      style={{
      }}
      mainStyle={{
        border: 0,
      }}
    >
      <div className={styles.Container}>
        <div className={styles.Title}>
          Referral Earning
        </div>
        <div className={styles.Content}>
          <div className={styles.Earned}>
            <div className={styles.EarnedTitle}>
              <div className={styles.EarnedTitleText}>
                EARNED
              </div>
              <div className={styles.EarnedTitleValue}>
                {userInfo?.referralFee || 0} SOL
              </div>
            </div>
            <div className={styles.Progress}>
              <div className={styles.ProgressValue} style={{ width: '25%' }} />
              <div className={styles.NodeList}>
                <div className={styles.NodeActive}>
                  <div className={styles.NodeLabel}>
                    Vol.50k
                  </div>
                  <div className={styles.NodeReward}>
                    <div className={styles.NodeRewardLabel}>
                      Earn Rewards
                    </div>
                    <div className={styles.NodeRewardContent}>
                      <div className={styles.NodeRewardValue}>
                        0.4 SOL
                      </div>
                      <div className={styles.NodeRewardUnit}>
                        /month
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.Node}>
                <div className={styles.NodeLabel}>
                    Vol.250k
                  </div>
                </div>
                <div className={styles.Node}>
                  <div className={styles.NodeLabel}>
                    Vol.500k
                  </div>
                  <div className={styles.NodeReward}>
                    <div className={styles.NodeRewardLabel}>
                      Earn Rewards
                    </div>
                    <div className={styles.NodeRewardContent}>
                      <div className={styles.NodeRewardValue}>
                        0.8 SOL
                      </div>
                      <div className={styles.NodeRewardUnit}>
                        /month
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.Node}>
                  <div className={styles.NodeLabel}>
                    Vol.1000k
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.Invite}>
            <div className={styles.InviteText}>
              Invite Friends and Earn Commissions Get up <br /> to <strong className={styles.InviteTextPrimary}>$5000</strong> rebates
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
    </Modal>
  );
};

export default ReferModal;

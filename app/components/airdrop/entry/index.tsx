import { AnimatePresence, motion } from 'framer-motion';
import styles from './index.module.css';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { useEffect } from 'react';
import Big from 'big.js';

const AirdropEntry = () => {
  const {
    userData,
    getUserData,
    setAirdropVisible,
    setAirdropEntryVisible,
    airdropEntryVisible,
    airdropEntryVisibleTimes,
    setAirdropEntryVisibleTimes,
  } = useAirdrop();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;
    const { points } = userData;
    if (Big(points || 0).gt(0) && airdropEntryVisibleTimes < 1) {
      setAirdropEntryVisible(true);
      setAirdropEntryVisibleTimes(1);
    }
  }, [userData, airdropEntryVisibleTimes]);

  return (
    <AnimatePresence mode="wait">
      {
        airdropEntryVisible && (
          <motion.div
            className={styles.Container}
            initial={{ y: -70 }}
            exit={{ y: -70 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
          >
            <div className={styles.Left}>
              <img src="/img/airdrop/coin-sun.svg" alt="" className={styles.Icon} />
            </div>
            <div className={styles.Text}>
              You have <strong className={styles.TextPrimary}>Airdrop</strong> event <br />points to claim!
            </div>
            <button
              type="button"
              className={styles.Button}
              onClick={() => {
                setAirdropVisible(true);
                setAirdropEntryVisible(false);
              }}
            >
              claim
            </button>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
};

export default AirdropEntry;

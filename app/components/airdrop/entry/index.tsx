import { AnimatePresence, motion } from 'framer-motion';
import styles from './index.module.css';
import { useAirdrop } from '@/app/components/airdrop/hooks';
import { useEffect, useRef, useState } from 'react';

const AirdropEntry = () => {
  const { getAirdropData, airdropData, setAirdropVisible } = useAirdrop();

  const timer = useRef<any>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    timer.current && clearInterval(timer.current);
    getAirdropData();
    // 10 minutes 1000*60*10=600000
    timer.current = setInterval(getAirdropData, 600000);

    return () => {
      timer.current && clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!airdropData) return;
    const { clime_pump } = airdropData;
    if (!clime_pump) {
      setVisible(true);
    }
  }, [airdropData]);

  return (
    <AnimatePresence mode="wait">
      {
        visible && (
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
                setVisible(false);
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

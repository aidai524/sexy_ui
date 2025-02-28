import styles from "./index.module.css";
import Level from "../level";
import { formatAddress } from "@/app/utils";
import { defaultAvatar } from "@/app/utils/config";
import FollowBtn from "@/app/sections/profile/components/followBtn";
import { formatLongText } from '@/app/utils/common';
import { useEffect, useState } from 'react';
import { useDebounceFn } from 'ahooks';
import { AnimatePresence, motion } from 'framer-motion';

export default function Avatar({
  userInfo,
  onEdit,
  isOther,
  address,
  isFollower,
  onFollowSuccess,
  isName = true,
  avatarStyle
}: any) {

  const [avatarShown, setAvatarShown] = useState(userInfo?.icon);

  // Avoid flickering default avatar
  const { run: handleAvatarShown, cancel: handleAvatarShownCancel } = useDebounceFn(() => {
    if (!userInfo?.icon) {
      setAvatarShown(defaultAvatar);
      return;
    }
    setAvatarShown(userInfo.icon);
  }, { wait: 150 });

  useEffect(() => {
    handleAvatarShownCancel();
    handleAvatarShown();
  }, [userInfo]);

  return (
    <>
      <AnimatePresence mode="wait">
        {
          avatarShown && (
            <motion.div
              className={styles.avatar}
              onClick={onEdit}
              style={avatarStyle}
              variants={{
                visible: {
                  borderColor: 'rgba(0, 0, 0, 1)',
                  transition: {
                    delay: 0.3,
                    ease: 'easeIn'
                  }
                },
                invisible: {
                  borderColor: 'rgba(0, 0, 0, 0)',
                },
              }}
              animate="visible"
              initial="invisible"
              exit="invisible"
            >
              <motion.img
                className={styles.avatarImg}
                src={avatarShown}
                variants={{
                  visible: {
                    opacity: 1,
                    transition: {
                      ease: 'easeIn'
                    }
                  },
                  invisible: {
                    opacity: 0,
                  },
                }}
              />
              {/*<div className={`${styles.pencil} button`}>
               <Pencil />
               </div>*/}
            </motion.div>
          )
        }
      </AnimatePresence>
      {
        isName && (
          <div className={styles.userName}>
            <div>
              {formatLongText(userInfo?.name, 9, 4) || formatAddress(userInfo?.address) || formatAddress(address) || 'FlipN'}
            </div>
            <Level level={userInfo?.level} vipType={userInfo?.vipType} style={{ marginLeft: 20 }} />
            {isOther && (
              <div className={styles.isOther}>
                <div className={styles.FollowBtnBox}>
                  <FollowBtn
                    address={address}
                    isFollower={isFollower}
                    onSuccess={onFollowSuccess}
                  />
                </div>
              </div>
            )}
          </div>
        )
      }
    </>
  );
}

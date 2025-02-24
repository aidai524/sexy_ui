import { motion } from "framer-motion";
import styles from "./laptop.module.css";
import { useAuth } from "@/app/context/auth";
import Panel from '@/app/sections/mining/component/panel';
import { addThousandSeparator, formatLongText, numberFormatter } from '@/app/utils/common';
import LimitProject from '@/app/sections/mining/component/limitProjects';
import { Earn } from '@/app/sections/mining/mobile/earn-invite/earn';
import { Invite } from '@/app/sections/mining/mobile/earn-invite/invite';
import { FollowX } from '@/app/sections/mining/mobile/earn-invite/follow-x';
import Icon from '@/app/components/points-label/Reicon';
import Rank from '@/app/sections/mining/component/rank/rank-icon';
import { formatAddress } from '@/app/utils';
import { Skeleton } from 'antd-mobile';

export default function Laptop({ info, infoLoading, rate, rateLoading }: any) {
  const { userInfo } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.MiningLaptopContainer}
    >
      <div className={styles.MiningInner}>
        <Panel isTape className={styles.MiningLeftWrapper}>
          <div className={styles.MiningUserInfo}>
            <img src={userInfo?.icon || '/img/avatar.png'} alt="" className={styles.MiningUserAvatar} />
            <div className={styles.MiningUserName}>
              {userInfo?.name || formatLongText(userInfo?.address, 6, 4)}
            </div>
          </div>
          <div className={styles.MiningSummaries}>
            <div className={styles.MiningSummary}>
              <div className={styles.MiningSummaryValuePrimary}>
                +{info?.once_like_amount || 0}
              </div>
              <div className={styles.MiningSummaryLabel}>
                $FLIPN / like
              </div>
            </div>
            <div className={styles.MiningSummary}>
              <div className={styles.MiningSummaryValue}>
                {info?.minted
                  ? numberFormatter(info.minted, 3, true, {
                    isShort: true,
                    round: 0
                  })
                  : "-"}
              </div>
              <div className={styles.MiningSummaryLabel}>
                My $FLIPN
              </div>
            </div>
          </div>
          <div className={styles.MiningStatistics}>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                My likes
              </div>
              <div className={styles.MiningStatisticsItemValueUnderline}>
                {info?.liked ? addThousandSeparator(info?.liked) : "-"}
              </div>
            </div>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                Refferrals
              </div>
              <div className={styles.MiningStatisticsItemValueUnderline}>
                {info?.my_referrals ? addThousandSeparator(info.my_referrals) : "-"}
              </div>
            </div>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                Kickback
              </div>
              <div className={styles.MiningStatisticsItemValue}>
                {info?.my_kickback
                  ? numberFormatter(info.my_kickback, 3, true, {
                    isShort: true,
                    round: 0
                  })
                  : "-"}
              </div>
            </div>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                My volume
              </div>
              <div className={styles.MiningStatisticsItemValueSm}>
                {info?.my_volume
                  ? numberFormatter(info?.my_volume, 2, true, {
                    isShort: true,
                    round: 0,
                    prefix: "$"
                  })
                  : "$0"}
              </div>
            </div>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                Launch Rate
              </div>
              <div className={styles.MiningStatisticsItemValueSm}>
                {info?.launching_rate ? (info.launching_rate * 100).toFixed(2) : "0"}%
              </div>
            </div>
            <div className={styles.MiningStatisticsItem}>
              <div className={styles.MiningStatisticsItemLabel}>
                Launched Projects
              </div>
              <div className={styles.MiningStatisticsItemValueImages}>
                <LimitProject list={info?.launched_project} />
              </div>
            </div>
          </div>
          <div className={styles.MiningEarn}>
            <div className={styles.MiningEarnTitle}>
              Earn
            </div>
            <div className={styles.MiningEarnContent}>
              <Earn info={info} />
              <Invite rate={rate} />
              <FollowX rate={rate} className={styles.MiningEarnFollowX} />
            </div>
          </div>
        </Panel>
        <Panel className={styles.MiningRightWrapper}>
          <div className={styles.MiningRightTitle}>Leaderboard</div>
          <div className={styles.MiningRightContent}>
            {
              infoLoading? [...new Array(10)].map((_, index: number) => (
                <div key={index} className={styles.MiningRightListItem}>
                  <div className={styles.MiningRightListItemLeft}>
                    <Rank
                      rank={index + 1}
                      className={styles.MiningRightListItemRank}
                      textClassName={styles.MiningRightListItemRankText}
                      isNormalBg={false}
                    />
                    <Skeleton animated className={styles.MiningRightListItemAvatar} />
                    <Skeleton animated style={{ width: 90, height: 17, borderRadius: 4 }} />
                  </div>
                  <div className={styles.MiningRightListItemRight}>
                    <Skeleton animated style={{ width: 60, height: 17, borderRadius: 4 }} />
                    <Skeleton animated style={{ width: 20, height: 20, borderRadius: 20 }} />
                  </div>
                </div>
              )) : info?.mining_rank?.map((item: any, index: number) => (
                <div key={index} className={styles.MiningRightListItem}>
                  <div className={styles.MiningRightListItemLeft}>
                    <Rank
                      rank={index + 1}
                      className={styles.MiningRightListItemRank}
                      textClassName={styles.MiningRightListItemRankText}
                      isNormalBg={false}
                    />
                    <img src={item.account_data?.icon || '/img/avatar.png'} alt="" className={styles.MiningRightListItemAvatar} />
                    <div className={styles.MiningRightListItemName}>
                      {item.account_data?.name
                        ? item.account_data.name
                        : item.address
                          ? formatAddress(item.address, 4)
                          : ""}
                    </div>
                  </div>
                  <div className={styles.MiningRightListItemRight}>
                    <div className={styles.MiningRightListItemRightValue}>
                      {numberFormatter(item.minted_amount, 3, true, {
                        isShort: true,
                        round: 0
                      })}
                    </div>
                    <Icon size={20} />
                  </div>
                </div>
              ))
            }
          </div>
          <div className={styles.MiningRightFoot}>
            <div className={styles.MiningRightFootLeft}>
              <div className={styles.MiningRightFootNo}>
                {info?.your_rank}
              </div>
              <img src={userInfo?.icon || '/img/avatar.png'} alt="" className={styles.MiningRightFootLeftAvatar} />
              <div className={styles.MiningRightFootName}>
                {userInfo?.name || formatLongText(userInfo?.address, 6, 4)}
              </div>
            </div>
            <div className={styles.MiningRightFootRight}>
              <div className="">
                {numberFormatter(info?.minted, 3, true, { isShort: true, isShortUppercase: true })}
              </div>
              <Icon size={20} />
            </div>
          </div>
        </Panel>
      </div>
    </motion.div>
  );
}

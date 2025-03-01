import styles from '@/app/components/airdrop/index.module.css';
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';
import React from 'react';

export const createLevelAndPoints = (params: any) => {
  const { userData, userHasPoints, airdropData } = params;

  const isClaimed = airdropData?.clime_pump;

  if (!userData || !Object.keys(userData).length) return [];

  return [
    {
      type: 'Level',
      total: `Lv.${userData.level}`,
      icon: `/img/airdrop/user-level${userHasPoints ? '' : '-inactive'}.svg`,
      desc: (
        <>
          Starts your Fun journey from <span className={styles.CardContentPrimary}>Lv. {userData.level}</span>, it will boost <span className={styles.CardContentPrimary}>10%</span> of mining.
        </>
      ),
    },
    {
      type: 'Points',
      total: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div>
            +{numberFormatter(userData.points, Big(userData.points || 0).gte(1e6) ? 2 : 0, true, { isShort: Big(userData.points || 0).gte(1e6), isShortUppercase: true })}
          </div>
          {
            isClaimed && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <img
                  src="/img/airdrop/icon-checked.svg"
                  alt=""
                  style={{
                    flexShrink: 0,
                    width: 19,
                    height: 19,
                  }}
                />
                <div
                  style={{
                    color: '#000',
                    fontFamily: 'Unbounded',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  Claimed
                </div>
              </div>
            )
          }
        </div>
      ),
      icon: '/img/airdrop/user-points.svg',
      desc: (
        <>
          You got <span className={styles.CardContentPrimary}>{numberFormatter(userData.points, 0, true)}</span> points on Fun based on your meme experience.
        </>
      ),
    },
  ];
};

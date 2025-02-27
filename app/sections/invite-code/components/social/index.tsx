import React from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { Links } from '@/app/components/menu/config';

const Social: React.FC<any> = (props) => {
  const { className } = props;

  return (
    <div className={clsx(styles.SocialContainer, className)}>
      {
        Links.map((item, index) => (
          <a key={index} target="_blank" href={item.href} className={styles.SocialItem} rel="nofollow">
            <img src={item.icon} alt="" className={styles.SocialItemIcon} />
          </a>
        ))
      }
    </div>
  );
};

export default Social;

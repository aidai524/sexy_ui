import styles from "./index.module.css";
import { getCurrentLevel } from '@/app/config';

export default function Level({ level, vipType, style, className }: any) {
  const _level: any = level || 1;
  const currentLevel = getCurrentLevel(_level);
  return (
    <div
      className={[styles.UserLevelContainer, className || ''].join(' ')}
      style={{
        // backgroundImage: `url(${!vipType || vipType === 'normal' ? '/img/profile/icon-level-inactive.svg' : '/img/profile/icon-level-active.svg'})`,
        // fix#REF-9505
        backgroundImage: currentLevel.theme,
        ...style,
      }}
    >
      <img src={currentLevel.icon} alt="" className={styles.UserLevelIcon} />
      <div>{currentLevel.label}</div>
    </div>
  );
}

import styles from './index.module.css';
import { Links } from '@/app/components/menu/config';

const ExpandPanelLinks = (props: any) => {
  const { className } = props;

  return (
    <div className={[styles.Links, className].join(' ')}>
      {Links.map((link: any) => (
        <a className="button" href={link.href} key={link.icon}>
          <img src={link.icon} className={styles.LinkIcon} />
        </a>
      ))}
    </div>
  );
};

export default ExpandPanelLinks;

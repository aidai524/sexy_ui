import styles from './index.module.css';
import clsx from 'clsx';

const Emoji = (props: any) => {
  const { className, content, placement } = props;

  return (
    <div className={clsx(styles.EmojiContainer, placement === 'right' && styles.EmojiContainerRight, className)}>
      <div className={clsx(styles.Emoji, placement === 'right' && styles.EmojiRight)}>{content}</div>
      <div className={clsx(styles.Emoji, placement === 'right' && styles.EmojiRight)}>{content}</div>
      <div className={clsx(styles.Emoji, placement === 'right' && styles.EmojiRight)}>{content}</div>
    </div>
  );
};

export default Emoji;

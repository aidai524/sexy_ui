import styles from './index.module.css';

const SortDirection = (props: any) => {
  const { onClick, value } = props;

  return (
    <button
      type="button"
      className={styles.Button}
      onClick={onClick}
    >
      <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M7 7.5L4 10L1 7.5" stroke="white" strokeWidth={value === 'desc' ? 1.6 : 1.2} strokeLinecap="round" strokeLinejoin="round" opacity={value === 'desc' ? 1 : 0.7} />
          <path d="M7 4L4 1.5L1 4" stroke="white" strokeWidth={value === 'asc' ? 1.6 : 1.2} strokeLinecap="round" strokeLinejoin="round" opacity={value === 'asc' ? 1 : 0.7} />
        </g>
      </svg>
    </button>
  );
};

export default SortDirection;

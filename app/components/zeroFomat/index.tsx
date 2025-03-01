import { useMemo } from 'react';
import styles from './index.module.css';

interface Props {
  value: string | number;
}
export default function ZeroFormat({ value }: Props) {
  const formattedValue = useMemo(() => {
    const numStr = String(value);
    
    // If number is not less than 1, return directly
    if (Number(numStr) >= 1 || !numStr.startsWith('0.')) {
      return <div>{numStr}</div>;
    }

    // Calculate the number of consecutive zeros after 0.
    const zeroCount = numStr.slice(2).match(/^0+/)?.[0]?.length || 0;
    
    if (zeroCount === 0) {
      return <div>{numStr}</div>;
    }

    // Get the non-zero number part
    const restNum = numStr.slice(2 + zeroCount, 2 + zeroCount + 4);

    return (
      <div className={styles.zeroFormat}>
        <span>0.</span>
        <span>0</span>
        <span className={styles.zeroCount}>{zeroCount}</span>
        <span>{restNum}</span>
      </div>
    );
  }, [value]);

  return formattedValue;
}

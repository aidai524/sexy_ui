'use client';

import { motion } from 'framer-motion';
import styles from './index.module.css';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import Popover, { PopoverPlacement } from '@/app/components/popover';
import { Order } from '@/app/sections/memes/config';

const MemesSelect = (props: any) => {
  const { className, value, onChange, options, renderSelectedLabel, renderLabel } = props;

  const popoverRef = useRef<any>();

  const [open, setOpen] = useState<boolean | undefined>(false);

  const handleSelect = (item: any) => {
    popoverRef.current?.onClose?.();
    onChange?.(item);
  };

  return (
    <Popover
      ref={popoverRef}
      placement={PopoverPlacement.BottomRight}
      content={(
        <div className={styles.MemesSelectDropdown}>
          {
            options?.map?.((item: any, index: number) => (
              <div
                key={index}
                className={value?.value === item.value ? styles.MemesSelectDropdownItemActive : styles.MemesSelectDropdownItem}
                onClick={() => handleSelect(item)}
              >
                {
                  typeof renderLabel === 'function' ? renderLabel(item, index) : item.label
                }
              </div>
            ))
          }
        </div>
      )}
      onVisibleChange={(visible) => {
        setOpen(visible);
      }}
    >
      <button
        type="button"
        className={clsx(styles.MemesSelectContainer, className)}
        onClick={() => {}}
      >
        <div className={styles.MemesSelectLabel}>
          {
            typeof renderSelectedLabel == 'function' ? renderSelectedLabel(value) : value?.label
          }
        </div>
        <motion.img
          src="/img/memes/icon-arrow-down.svg"
          alt=""
          className={styles.MemesSelectArrow}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </button>
    </Popover>
  );
};

export default MemesSelect;

import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import clsx from 'clsx';
import { useDebounceFn } from 'ahooks';
import { httpAuthPost } from '@/app/utils';
import { trim } from 'lodash-es';
import { fail, success } from "@/app/utils/toast";
import Loading from '@/app/components/icons/loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUserAgent } from '@/app/context/user-agent';

const InviteCodeForm: React.FC<any> = (props) => {
  const { className } = props;

  const router = useRouter();
  const { isMobile } = useUserAgent();
  const searchParams = useSearchParams();

  const codeParam = searchParams.get('code');

  const inputRef = useRef<any>();
  const [code, setCode] = useState<string>();
  const [pending, setPending] = useState<boolean>();
  const [codeValid, setCodeValid] = useState<boolean>();
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const handleCodeChange=  (value?: string) => {
    setCodeValid(void 0);
    setCode(value);
  };

  const { run: handleCodeVerify, cancel: handleCodeVerifyCancel } = useDebounceFn(async (value?: string) => {
    if (pending || !trim(value) || codeValid) return;
    setPending(true);
    try {
      const urlParams = new URLSearchParams();
      urlParams.set('code', trim(value));
      const res = await httpAuthPost(`/airdrop/binding/code?${urlParams.toString()}`, {
        code: trim(value),
      });
      if (res.code !== 0) {
        setPending(false);
        fail((
          <ToastMsg title="Invalid" msg={res.message || 'Failed to verify code'} />
        ), { isIcon: false });
        setCodeValid(false);
        return;
      }
      success((
        <ToastMsg title="Success" msg="Let’s get started!" />
      ));
      setCodeValid(true);
    } catch (err: any) {
      fail((
        <ToastMsg title="Invalid" msg={err.message || 'Failed to verify code'} />
      ), { isIcon: false });
      setCodeValid(false);
    }
    setPending(false);
  }, {
    wait: 150
  });

  const handleStart = () => {
    setIsStarted(true);
    const timer = setTimeout(() => {
      clearTimeout(timer);
      router.replace('/');
    }, 300);
  };

  useEffect(() => {
    inputRef.current?.focus?.();
    if (codeParam) {
      setCode(trim(codeParam));
    }
  }, [codeParam]);

  return (
    <div className={clsx(isMobile ? styles.InviteCodeFormContainer : styles.InviteCodeFormContainerLaptop, className)}>
      <div className={styles.InviteCodeFormTop}>
        <img src="/img/logo.svg" alt="" className={styles.InviteCodeFormLogo} />
        <div className={styles.InviteCodeFormTips}>
          Launch & trade memecoins as easy as scrolling through socials media
        </div>
        <div className={styles.InviteCodeFormLabel}>
          Invite Code
        </div>
        <div className={styles.InviteCodeFormControlWrapper}>
          <input
            ref={inputRef}
            type="text"
            disabled={pending || codeValid}
            className={codeValid === false ? styles.InviteCodeFormControlInvalid : styles.InviteCodeFormControl}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onBlur={(e) => handleCodeVerify(e.target.value)}
            onFocus={handleCodeVerifyCancel}
          />
        </div>
      </div>
      <motion.div
        className={styles.InviteCodeFormBottom}
        animate={{
          rotate: isStarted ? 5 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15
        }}
      >
        <button
          disabled={pending || !codeValid}
          type="button"
          className={styles.InviteCodeFormButton}
          onClick={handleStart}
        >
          {
            pending && (
              <Loading size={16} />
            )
          }
          <div>Start!</div>
        </button>
      </motion.div>
    </div>
  );
};

export default InviteCodeForm;

const ToastMsg = (props: any) => {
  const { title, msg } = props;

  return (
    <div className={styles.InviteCodeFormToast}>
      <div className={styles.InviteCodeFormToastTitle}>
        {title}
      </div>
      <div className={styles.InviteCodeFormToastMsg}>
        {msg}
      </div>
    </div>
  );
};

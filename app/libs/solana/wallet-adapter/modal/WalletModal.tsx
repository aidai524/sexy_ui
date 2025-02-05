import type { Adapter } from "@solana/wallet-adapter-base";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, MouseEvent, useContext, useEffect } from 'react';
import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { Collapse } from "./Collapse";
import { WalletListItem } from "./WalletListItem";
import { WalletSVG } from "./WalletSVG";
import { useWalletModal } from "./useWalletModal";
import { getDeviceType, sleep } from "@/app/utils";
import { usePrivy, useLoginWithEmail, useSolanaWallets } from '@privy-io/react-auth';
import Loading from '@/app/components/icons/loading';
import { fail, success } from '@/app/utils/toast';
import Modal from '@/app/components/modal';
import { PrivyWalletContext } from '@/app/context/privy';

export interface WalletModalProps {
  className?: string;
  container?: string;
  sortedWallets?: string[];
  disabledWallets?: string[];
}

export const WalletModal: FC<WalletModalProps> = (props) => {
  const {
    className = "",
    container = "body",
    sortedWallets = [],
    disabledWallets = []
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { wallets, select, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const { privyVisible } = useContext(PrivyWalletContext);

  const [expanded, setExpanded] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const [portal, setPortal] = useState<Element | null>(null);

  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notInstalled: Wallet[] = [];

    // Sort wallets by sortedWallets order and then by name，if not in sortedWallets, put it in the end
    const _wallets = wallets
      .filter((wallet) => !disabledWallets.includes(wallet.adapter.name))
      .sort((a, b) => {
        const aIndex = sortedWallets.indexOf(a.adapter.name);
        const bIndex = sortedWallets.indexOf(b.adapter.name);

        if (aIndex === -1 && bIndex === -1)
          return a.adapter.name.localeCompare(b.adapter.name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });

    for (const wallet of _wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      } else {
        notInstalled.push(wallet);
      }
    }

    return installed.length ? [installed, notInstalled] : [notInstalled, []];
  }, [disabledWallets, sortedWallets, wallets]);

  const hideModal = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => setVisible(false), 150);
  }, [setVisible]);

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event?.preventDefault?.();
      hideModal();
    },
    [hideModal]
  );

  const handleWalletClick = useCallback(
    async (event: MouseEvent, wallet: Adapter) => {
      if (getDeviceType().mobile || wallet.name === "WalletConnect") {
        hideModal();
        select(wallet.name);
        await sleep(500);
        await wallet.connect();
        handleClose(event);
      } else {
        select(wallet.name);
        handleClose(event);
      }
    },
    [select, handleClose, hideModal]
  );

  const handleCollapseClick = useCallback(
    () => setExpanded(!expanded),
    [expanded]
  );

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const node = ref.current;
      if (!node) return;

      // here we query all focusable elements
      const focusableElements = node.querySelectorAll("button");
      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey) {
        // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    },
    [ref]
  );

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideModal();
      } else if (event.key === "Tab") {
        handleTabKey(event);
      }
    };

    // Get original overflow
    const { overflow } = window.getComputedStyle(document.body);
    // Hack to enable fade in animation after mount
    setTimeout(() => setFadeIn(true), 0);
    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";
    // Listen for keydown events
    window.addEventListener("keydown", handleKeyDown, false);

    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [hideModal, handleTabKey]);

  useLayoutEffect(
    () => setPortal(document.querySelector(container)),
    [container]
  );

  return (
    portal &&
    createPortal(
      <div
        aria-labelledby="wallet-adapter-modal-title"
        aria-modal="true"
        className={`wallet-adapter-modal ${
          fadeIn && "wallet-adapter-modal-fade-in"
        } ${className}`}
        ref={ref}
        role="dialog"
      >
        <div className="wallet-adapter-modal-container">
          <div className="wallet-adapter-modal-wrapper">
            <button
              onClick={handleClose}
              className="wallet-adapter-modal-button-close"
            >
              <svg width="14" height="14">
                <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" />
              </svg>
            </button>
            <h1 className="wallet-adapter-modal-title">Connect Wallet</h1>
            <h2 className="wallet-adapter-modal-sub-title">
              You need to connect a solana wallet.
            </h2>
            {
              privyVisible && (
                <PrivyEmail {...props} onClose={handleClose} />
              )
            }
            {listedWallets.length ? (
              <>
                <div className="wallet-adapter-modal-label">Recently Used</div>
                <ul className="wallet-adapter-modal-list">
                  {listedWallets.map((wallet) => (
                    <WalletListItem
                      key={wallet.adapter.name}
                      handleClick={(event) =>
                        handleWalletClick(event, wallet.adapter)
                      }
                      wallet={wallet}
                    />
                  ))}
                  <div className="wallet-adapter-modal-label wallet-adapter-modal-list-more">
                    <span>{expanded ? "Less " : "More "}Wallets</span>
                    <Arrow
                      style={{
                        transform: expanded ? 'rotate(180deg)' : '',
                      }}
                      onClick={handleCollapseClick}
                    />
                  </div>
                  {collapsedWallets.length ? (
                    <Collapse
                      expanded={expanded}
                      id="wallet-adapter-modal-collapse"
                    >
                      {collapsedWallets.map((wallet) => (
                        <WalletListItem
                          key={wallet.adapter.name}
                          handleClick={(event) =>
                            handleWalletClick(event, wallet.adapter)
                          }
                          tabIndex={expanded ? 0 : -1}
                          wallet={wallet}
                        />
                      ))}
                    </Collapse>
                  ) : null}
                </ul>
              </>
            ) : (
              <>
                <div className="wallet-adapter-modal-middle">
                  <WalletSVG />
                </div>
                <div
                  className="wallet-adapter-modal-title"
                  style={{ paddingTop: "0px" }}
                >
                  New here?
                </div>
                <div
                  className="wallet-adapter-modal-sub-title"
                  style={{ paddingBottom: "0px" }}
                >
                  Welcome to DiFi! Create a crypto wallet to get started!
                </div>
                {collapsedWallets.length ? (
                  <>
                    <button
                      className="wallet-adapter-modal-list-more"
                      onClick={handleCollapseClick}
                      tabIndex={0}
                    >
                      <span>
                        {expanded ? "Hide " : "Already have a wallet? View "}
                        options
                      </span>
                      <svg
                        width="13"
                        height="7"
                        viewBox="0 0 13 7"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${
                          expanded
                            ? "wallet-adapter-modal-list-more-icon-rotate"
                            : ""
                        }`}
                      >
                        <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                      </svg>
                    </button>
                    <Collapse
                      expanded={expanded}
                      id="wallet-adapter-modal-collapse"
                    >
                      <ul className="wallet-adapter-modal-list">
                        {collapsedWallets.map((wallet) => (
                          <WalletListItem
                            key={wallet.adapter.name}
                            handleClick={(event) =>
                              handleWalletClick(event, wallet.adapter)
                            }
                            tabIndex={expanded ? 0 : -1}
                            wallet={wallet}
                          />
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div
          className="wallet-adapter-modal-overlay"
          onMouseDown={handleClose}
        />
      </div>,
      portal
    )
  );
};

const PrivyEmail = (props: any) => {
  const { onClose } = props;

  const { creatingWallet } = useContext(PrivyWalletContext);

  const { ready, authenticated, user } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();
  const { wallets: solanaWallets } = useSolanaWallets();

  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [logging, setLogging] = useState<boolean>(false);
  const [sentCode, setSentCode] = useState<boolean>(false);

  const handleEmailChange = (e: any) => {
    const val = e.target.value;
    setEmail(val);
  };

  const handleCodeChange = (e: any) => {
    const val = e.target.value;
    setCode(val);
  };

  const handleSendCode = async () => {
    if (sendingCode || !email) return;
    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(email)) {
      fail('Please enter a valid email address', { maskStyle: { zIndex: 2000 } });
      return;
    }
    setSendingCode(true);
    sendCode({ email }).then((res) => {
      success('The verification code has been sent to your email', { maskStyle: { zIndex: 2000 } });
      setSentCode(true);
    }).catch((err) => {
      fail('Please enter a valid email address', { maskStyle: { zIndex: 2000 } });
    }).finally(() => {
      setSendingCode(false);
    });
  };

  const handleLogIn = () => {
    if (logging|| !code) return;
    setLogging(true);
    loginWithCode({ code }).then((res) => {
      // Success
      success('Successfully logged in', { maskStyle: { zIndex: 2000 } });
      setSentCode(false);
      onClose();
      setCode('');
      setEmail('');
    }).catch((err) => {
      console.log(err);
      fail('Invalid code' + (err?.message ? ': ' + err.message : ''), { maskStyle: { zIndex: 2000 } });
    }).finally(() => {
      setLogging(false);
    });
  };

  return (
    <div className="privy-wallet-email-container">
      <div className="privy-wallet-email-label">
        <div>Log in or sign up</div>
      </div>
      <PrivyEmailControl
        onSubmit={handleSendCode}
        onChange={handleEmailChange}
        value={email}
        loading={logging}
        disabled={sendingCode || !ready}
        icon="/img/icon-email.svg"
        placeholder="your@email.com"
        buttonText="Submit"
        inputType="email"
      />
      {/*<button
        type="button"
        style={{ color: '#fff', width: '100%', padding: '10px', border: '1px solid #ededed', marginBottom: 10 }}
        onClick={async () => {
          logout();
          const privyEmbeddedWallet = solanaWallets.find((it) => it.walletClientType === 'privy');
          privyEmbeddedWallet?.disconnect?.();
        }}
      >
        LogOut
      </button>*/}
      <PrivyEmailCodeModal
        visible={sentCode}
        onClose={() => {
          setSentCode(false);
          setCode('');
        }}
        handleLogIn={handleLogIn}
        logging={logging}
        handleCodeChange={handleCodeChange}
        code={code}
        creatingWallet={creatingWallet}
        ready={ready}
        email={email}
        handleSendCode={handleSendCode}
        sendingCode={sendingCode}
      />
    </div>
  );
};

const PrivyEmailControl = (props: any) => {
  const { value, onSubmit, loading, icon, disabled, buttonText, placeholder, inputType, onChange } = props;

  return (
    <div className="privy-wallet-email-control-container">
      <img src={icon} alt="" className="privy-wallet-email-control-icon" />
      <input
        type={inputType}
        value={value}
        className="privy-wallet-email-control"
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            onSubmit();
          }
        }}
      />
      <button
        type="button"
        className="privy-wallet-email-control-addon"
        disabled={disabled}
        onClick={onSubmit}
      >
        {
          loading && (
            <Loading size={14} />
          )
        }
        <span>{buttonText}</span>
      </button>
    </div>
  );
};

const Arrow = (props: any) => {
  const { style, onClick } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="9"
      viewBox="0 0 15 9"
      fill="none"
      style={style}
      onClick={onClick}
    >
      <path
        d="M14 1L7.5 7L1 0.999999"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const PrivyEmailCodeModal = (props: any) => {
  const {
    visible,
    onClose,
    handleLogIn,
    logging,
    handleCodeChange,
    code,
    creatingWallet,
    ready,
    email,
    handleSendCode,
    sendingCode,
  } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      style={{
        zIndex: 1041,
      }}
      forceNoCloseIcon={true}
    >
      <div className="privy-wallet-email-code-card">
        <div className="privy-wallet-email-code-header">
          <button type="button" className="privy-wallet-email-code-back" onClick={onClose}>
            <Arrow
              style={{
                transform: 'rotate(90deg)',
              }}
            />
          </button>
          <div className="privy-wallet-email-code-title">
            Enter confirmation code
          </div>
        </div>
        <div className="privy-wallet-email-code-desc">
          Please check <span style={{ textDecoration: 'underline' }}>{email}</span> for an email from privy.io and enter your code below.
        </div>
        <PrivyEmailControl
          onSubmit={handleLogIn}
          onChange={handleCodeChange}
          value={code}
          loading={logging || creatingWallet}
          disabled={logging || !ready || creatingWallet}
          icon="/img/icon-email.svg"
          placeholder="Your code"
          buttonText="Log in"
          inputType="text"
        />
        <div className="privy-wallet-email-code-foot">
          <div className="">
            Didn&#39;t get an email? <button type="button" className="privy-wallet-email-code-resend" onClick={handleSendCode} disabled={sendingCode}>
            Resend code</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

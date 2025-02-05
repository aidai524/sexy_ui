import { FC, MouseEvent, useContext } from 'react';
import React, { useCallback } from "react";
import type { ButtonProps } from "./Button";
import { Button as BaseWalletConnectionButton } from "./Button";
import { useWalletModal } from "./useWalletModal";
import { removeAuth } from "@/app/utils";
import { PrivyWalletContext } from '@/app/context/privy';

export const WalletModalButton: FC<ButtonProps> = ({
  children = "Select Wallet",
  onClick,
  isPrivy,
  ...props
}) => {
  const { visible, setVisible } = useWalletModal();
  const { setPrivyVisible } = useContext(PrivyWalletContext);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      removeAuth();
      if (onClick) onClick(event);
      if (!event.defaultPrevented) {
        setVisible(!visible);
        setPrivyVisible?.(!!isPrivy);
      }
    },
    [onClick, setVisible, visible]
  );

  return (
    <BaseWalletConnectionButton
      className="wallet-adapter-button-trigger"
      {...props}
      onClick={handleClick}
    >
      {children}
    </BaseWalletConnectionButton>
  );
};

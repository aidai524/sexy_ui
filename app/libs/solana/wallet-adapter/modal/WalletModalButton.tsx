import type { FC, MouseEvent } from "react";
import React, { useCallback } from "react";
import type { ButtonProps } from "./Button";
import { Button as BaseWalletConnectionButton } from "./Button";
import { useWalletModal } from "./useWalletModal";
import { removeAuth } from "@/app/utils";

export const WalletModalButton: FC<ButtonProps> = ({
  children = "Select Wallet",
  onClick,
  ...props
}) => {
  const { visible, setVisible } = useWalletModal();

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      removeAuth();
      if (onClick) onClick(event);
      if (!event.defaultPrevented) setVisible(!visible);
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

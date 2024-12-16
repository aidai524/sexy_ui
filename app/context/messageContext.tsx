"use client"

import type { ReactNode } from "react";
import React, {
    useContext,
    useState,
    useMemo,
} from "react";

interface MessageContextValue {
    likeTrigger: boolean;
    hateTrigger: boolean;
    setLikeTrigger: (val: boolean) => void;
    setHateTrigger: (val: boolean) => void;
}

const MessageContext =
    React.createContext<MessageContextValue | null>(null);

export const MessageContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [likeTrigger, setLikeTrigger] = useState(false)
    const [hateTrigger, setHateTrigger] = useState(false)

    const walletTypeContextValue = useMemo<MessageContextValue>(
        () => ({
            likeTrigger,
            hateTrigger,
            setLikeTrigger,
            setHateTrigger
        }),
        [likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger]
    );

    return (
        <MessageContext.Provider value={walletTypeContextValue}>
            {children}
        </MessageContext.Provider>
    );
}

export function useMessage() {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error(
            "useWalletType must be used within a WalletTypeContextProvider"
        );
    }

    return context;
}
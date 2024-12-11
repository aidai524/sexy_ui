"use client"

import type { ReactNode } from "react";
import React, {
    useCallback,
    useContext,
    useEffect,
    useState,
    useMemo,
} from "react";
import { UserInfo } from "../type";

interface MessageContextValue {
    likeTrigger: boolean;
    setLikeTrigger: (val: boolean) => void;
}

const MessageContext =
    React.createContext<MessageContextValue | null>(null);

export const MessageContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [likeTrigger, setLikeTrigger] = useState(false)

    const walletTypeContextValue = useMemo<MessageContextValue>(
        () => ({
            likeTrigger,
            setLikeTrigger
        }),
        [likeTrigger, setLikeTrigger]
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
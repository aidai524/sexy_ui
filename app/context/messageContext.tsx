"use client"

import type { ReactNode } from "react";
import React, {
    useContext,
    useState,
    useMemo,
    useRef,
    useEffect,
} from "react";
import ShareTemplate from "../components/shareTemplate";
import { Project } from "../type";

interface MessageContextValue {
    likeTrigger: boolean;
    hateTrigger: boolean;
    setLikeTrigger: (val: boolean) => void;
    setHateTrigger: (val: boolean) => void;
    getShareImg: (token: Project) => string | null;
}

const MessageContext =
    React.createContext<MessageContextValue | null>(null);

export const MessageContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [likeTrigger, setLikeTrigger] = useState(false)
    const [hateTrigger, setHateTrigger] = useState(false)
    const [currentToken, setCurrentToken] = useState<Project>()
    const shareInstance = useRef<any>()

    const walletTypeContextValue = useMemo<MessageContextValue>(
        () => ({
            likeTrigger,
            hateTrigger,
            setLikeTrigger,
            setHateTrigger,
            getShareImg: (token: Project) => {
                setCurrentToken(token)
                if (shareInstance.current) {
                    return shareInstance.current.getImgUrl()
                }
                
            }
        }),
        [likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger]
    );

   

    return (
        <MessageContext.Provider value={walletTypeContextValue}>
            {children}
            <ShareTemplate ref={shareInstance} token={currentToken} />
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
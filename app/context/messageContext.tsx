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
    showShare: (token: Project, shareTemplateNew?: boolean, closeFn?: any) => void;
}

const MessageContext =
    React.createContext<MessageContextValue | null>(null);

export const MessageContextProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [likeTrigger, setLikeTrigger] = useState(false)
    const [hateTrigger, setHateTrigger] = useState(false)
    const [currentToken, setCurrentToken] = useState<Project>()
    const [shareTemplateShow, setShareTemplateShow] = useState<boolean>(false)
    const [shareTemplateNew, setShareTemplateNew] = useState<boolean>(false)
    const [closeFn, setcloseFn] = useState<any>()
    const shareInstance = useRef<any>()

    const walletTypeContextValue = useMemo<MessageContextValue>(
        () => ({
            likeTrigger,
            hateTrigger,
            setLikeTrigger,
            setHateTrigger,
            showShare: (token: Project, shareTemplateNew = false, closeFn) => {
                setCurrentToken(token)
                setShareTemplateShow(true)
                setShareTemplateNew(shareTemplateNew)
                setcloseFn(closeFn)
                // if (shareInstance.current) {
                //     return shareInstance.current.getImgUrl()
                // }

            }
        }),
        [likeTrigger, setLikeTrigger, hateTrigger, setHateTrigger]
    );

    return (
        <MessageContext.Provider value={walletTypeContextValue}>
            {children}
            <ShareTemplate
                isNew={shareTemplateNew}
                show={shareTemplateShow}
                ref={shareInstance}
                token={currentToken}
                onClose={() => {
                    closeFn && closeFn()
                    setShareTemplateShow(false)
                }} />

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
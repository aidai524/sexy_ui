import { useEffect, useState } from "react";
import styles from "./trande.module.css";
import MainBtn from "@/app/components/mainBtn";
import { Avatar } from "../../thumbnail";
import type { Project } from "@/app/type";
import Big from "big.js";
import { useTokenTrade } from "@/app/hooks/useTokenTrade";
import { fail, success } from "@/app/utils/toast";
import { useAccount } from "@/app/hooks/useAccount";

interface Props {
    token: Project;
    onSuccess?: () => void;
    panelStyle?: any;
    modalShow: boolean;
}

const max = 0.05

export default function Trade({ token, panelStyle, modalShow, onSuccess }: Props) {
    const [inputVal, setInputVal] = useState(max.toString());
    const [isLoading, setIsLoading] = useState(false);
    const [isPrePayd, setIsPrePayd] = useState(false);
    const { address } = useAccount()

    const { prePaid, checkPrePayed } = useTokenTrade({
        tokenName: token.tokenName,
        tokenSymbol: token.tokenSymbol as string,
        tokenDecimals: token.tokenDecimals as number,
        loadData: false
    });

    useEffect(() => {
        if (address === token.account) {
            setIsPrePayd(true)
            return
        }
        checkPrePayed().then(prdPaydval => {
            setIsPrePayd(prdPaydval > 0)
        })
    }, [checkPrePayed, address, token])

    useEffect(() => {
        if (!modalShow) {
            setInputVal(max.toString())
            setIsLoading(false)
        }
    }, [modalShow])

    return (
        <div className={styles.main}>
            <div className={styles.avatar}>
                <Avatar data={token} showLaunchType={true} />
            </div>

            <div
                className={[styles.cationArea, styles.panel].join(" ")}
                style={panelStyle}
            >
                <div className={styles.inputArea}>
                    <div className={styles.actionArea}>
                        <div className={styles.switchToken}>
                            <span className={styles.switchTitle}>Pre Buy</span>
                        </div>
                        <div className={styles.slippage}>Maximum {max} SOL</div>
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            value={inputVal}
                            onChange={(e) => {
                                setInputVal(e.target.value);
                            }}
                            className={styles.input}
                        />
                        <div className={styles.inputToken}>
                            <div className={styles.tokenName}>SOL</div>
                            <div className={styles.tokenImg}>
                                <img
                                    className={styles.tiImg}
                                    src="/img/home/solana.png"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 30 }} className={styles.receiveTokenAmount}>
                    {
                        isPrePayd
                            ? <div className={styles.receiveTitle}>You have bought this meme. You can view it on your account page。</div>
                            : <div className={styles.receiveTitle}>
                                You will auto-buy in when this meme launched. You can withdraw
                                anytime before launching.
                            </div>
                    }
                </div>
                <div style={{ marginTop: 18 }}>
                    <MainBtn
                        isDisabled={!inputVal || Number(inputVal) > max || isPrePayd}
                        isLoading={isLoading}
                        onClick={async () => {
                            try {
                                if (inputVal) {
                                    setIsLoading(true);
                                    const inputNum = new Big(inputVal).mul(10 ** 9).toFixed(0);
                                    await prePaid(
                                        inputNum,
                                        token.tokenName,
                                        token.tokenSymbol || token.tokenName.toUpperCase()
                                    );
                                    setIsLoading(false);
                                    success("Smoke like success");

                                    onSuccess && onSuccess();
                                }
                            } catch (e: any) {
                                console.log(e);
                                fail(e.toString());
                                setIsLoading(false);
                            }
                        }}
                        style={{ backgroundColor: "#9514FF" }}
                    >
                        Pre-Buy
                    </MainBtn>
                </div>
            </div>
        </div>
    );
}

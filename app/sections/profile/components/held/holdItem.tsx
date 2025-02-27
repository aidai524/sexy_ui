import Media from "@/app/components/thumbnail/media";
import styles from "./held.module.css";
import { checkFileType, httpGet, simplifyNum } from "@/app/utils";
import Big from "big.js";
import { numberFormatter } from "@/app/utils/common";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const netParam = process.env.NEXT_PUBLIC_NET === 'Mainnet' ? '' : '?cluster=devnet'
export default function HoldItem(props: any) {
    const { item, from, tokenInfo, tokenPrice } = props;
    const router = useRouter();
    const [icon, setIcon] = useState('');

    useEffect(() => {
        const type = checkFileType(item.token_icon);
        if (type === 'image') {
            setIcon(item.token_icon);
        } else {
            httpGet("/project", { address: item.token_address }).then((res) => {
                if (res.code === 0 && res.data && res.data.length) {
                    setIcon(res.data[0].icon);
                }
            })
        }
    }, [item])

    return <div
        className={`${styles.heldToken} ${from === "page" && styles.PageHeldToken
            }`}
        onClick={() => {
            // console.log(item)
            router.push(
                "/detail?address=" + item.token_address + "&from=profile"
            );
            // window.open('https://solscan.io/account/' + item.token_account)
        }}
        key={item.token_address}
    >
        <div className={styles.tokenMsg}>
            <Media
                data={{
                    tokenImg: icon || item.token_icon
                }}
                imgHeight={46}
                autoPlay={false}
                imgStyle={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    objectFit: "cover",
                    objectPosition: "center"
                }}
                style={{
                    overflow: "hidden",
                    width: 46,
                    height: 46,
                }}
                videoStyle={{
                    height: "100%",
                    background: "#000"
                }}
            />
            <div className={styles.tokenNames}>
                <div className={styles.name}>
                    {item.token_name}
                </div>
                <div
                    className={styles.viewCoin}
                    onClick={(e) => {
                        e.stopPropagation()
                        window.open(
                            'https://solscan.io/account/' + item.token_account + netParam
                        );
                    }}
                >
                    <span className={styles.viewCoinText}>View Coin</span>
                    <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7.5 1C7.5 0.723858 7.27614 0.5 7 0.5L2.5 0.500001C2.22386 0.5 2 0.723858 2 1C2 1.27614 2.22386 1.5 2.5 1.5L6.5 1.5L6.5 5.5C6.5 5.77614 6.72386 6 7 6C7.27614 6 7.5 5.77614 7.5 5.5L7.5 1ZM1.35355 7.35355L7.35355 1.35355L6.64645 0.646447L0.646447 6.64645L1.35355 7.35355Z"
                            fill="#7E8A93"
                        />
                    </svg>
                </div>
            </div>
        </div>

        <div className={styles.tokenValue}>
            <div className={styles.tokenAmount}>
                {simplifyNum(
                    new Big(item.token_balance)
                        .div(10 ** item.token_decimals)
                        .toNumber(),
                    2
                )}
            </div>
            <div className={styles.solPrice}>
                {tokenPrice[item.token_address]
                    ? numberFormatter(
                        Big(tokenPrice[item.token_address]).times(
                            Big(item.token_balance).div(10 ** item.token_decimals)
                        ),
                        4,
                        true
                    )
                    : "~"}{" "}
                SOL
            </div>
        </div>
    </div>;
}

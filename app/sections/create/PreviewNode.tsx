import InfoPart from "../detail/components/info/infoPart";
import styles from './preview.module.css'
import Create from "./components/create";


import type { Project } from "@/app/type";
import { useEffect, useState } from "react";
import { httpAuthPost, sleep } from "@/app/utils";
import useUserInfo from "../profile/hooks/useUserInfo";
import { useAppKitAccount } from "@reown/appkit/react";
import { fail, success } from "@/app/utils/toast";
interface Props {
    onAddDataCancel: () => void;
    show: boolean;
    data: Project;
}

export default function PreviewNode({
    onAddDataCancel, show, data
}: Props) {
    const [showCreate, setShowCreate] = useState(false)
    const [newData, setNewData] = useState(data)

    const { address } = useAppKitAccount()
    const { userInfo } = useUserInfo(address)

    useEffect(() => {
        if (userInfo) {
            const newData = {
                ...data,
                account: userInfo.address,
                time: Date.now(),
            }
            setNewData(newData)
        }
    }, [data, userInfo])

    return <div className={styles.mainContent} style={{ display: show ? 'block' : 'none' }}>
        <div className={styles.main}>
            <InfoPart showBackIcon={false} showThumbnailHead={true} showThumbnailProgress={false} data={newData} />
        </div>

        <div className={styles.actionBtns}>
            <div onClick={() => {
                onAddDataCancel()
            }} className={styles.btn + ' ' + styles.edit}>Edit</div>
            <div onClick={() => {
                setShowCreate(true)
            }} className={styles.btn + ' ' + styles.create}>Create</div>
        </div>

        <Create
            show={showCreate}
            token={{
                tokenName: data.tokenName,
                tokenSymbol: data.tokenName.toUpperCase(),
                tokenDecimals: 2,
                tokenUri: data.tokenImg,
            }}
            data={data}
            onHide={() => { setShowCreate(false) }}
            onCreateTokenSuccess={async () => {
                const query: any  = {
                    about_us: data.about,
                    discord: data.discord,
                    icon: data.tokenImg,
                    // icon: 'http://localhost:3000/create',
                    tg: '',
                    ticker: data.ticker,
                    token_name: data.tokenName,
                    token_symbol: data.tokenName.toUpperCase(),
                    video: data.tokenImg,
                    // video: 'http://localhost:3000/create',
                    website: data.website,
                    x: data.twitter
                }

                const queryStr = Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')

                let times = 0, val
                while (true && times < 10) {
                    val = await httpAuthPost(`/project?${queryStr}`, {})
                    if (val.code === 100000) {
                        times++
                        sleep(500)
                    } else {
                        break
                    }
                }

                if (val.code === 0) {
                    success('Create token success')
                } else {
                    fail('Create token fail')
                }
            }}
        />
    </div>
}
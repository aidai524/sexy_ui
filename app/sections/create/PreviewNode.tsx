import InfoPart from "../detail/components/info/infoPart";
import styles from './preview.module.css'
import Create from "./components/create";


import type { Project } from "@/app/type";
import { useEffect, useState } from "react";
import { httpAuthPost, sleep } from "@/app/utils";
import { fail, success } from "@/app/utils/toast";
import { useRouter } from "next/navigation";
import { useAccount } from '@/app/hooks/useAccount';
import { useUser } from "@/app/store/useUser";
interface Props {
    onAddDataCancel: () => void;
    show: boolean;
    data: Project;
}

export default function PreviewNode({
    onAddDataCancel, show, data
}: Props) {
    const router = useRouter()
    const [showCreate, setShowCreate] = useState(false)
    const [newData, setNewData] = useState(data)

    const { address } = useAccount()
    const { userInfo }: any = useUser()

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
            <InfoPart specialTime={'just now'} showBackIcon={false} showThumbnailHead={true} showThumbnailProgress={false} data={newData} />
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
                    icon: data.tokenIcon,
                    tg: '',
                    ticker: data.ticker,
                    token_name: data.tokenName,
                    token_symbol: data.tokenName.toUpperCase(),
                    video: data.tokenImg,
                    website: data.website,
                    x: data.twitter
                }

                const queryStr = Object.keys(query).map(key => `${key}=${encodeURIComponent(query[key])}`).join('&')

                let times = 0, val
                while (true && times < 50) {
                    val = await httpAuthPost(`/project?${queryStr}`, {})
                    if (val.code === 100000) {
                        times++
                        await sleep(5000)
                    } else {
                        break
                    }
                }

                if (val.code === 0) {
                    success('Create token success')
                    router.push('/profile')
                } else {
                    fail('Create token fail')
                    
                }
            }}
        />
    </div>
}
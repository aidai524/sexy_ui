import type { UserInfo } from '@/app/type'
import styles from './follow.module.css'
import { formatAddress } from '@/app/utils';
import { useRouter } from 'next/navigation';
import FollowBtn from '../../../components/followBtn';
import { Empty } from 'antd-mobile';
import { useUser } from '@/app/store/useUser';

interface Props {
    list: UserInfo[];
    followerType: number;
    onAction?: () => void;
}

const defaultAvatar = '/img/avatar.png'

export default function  FollowerList({
    list,
    followerType,
    onAction,
}: Props) {
    const router = useRouter()
    const { userInfo }: any = useUser()

    console.log('userInfo:', userInfo)

    return <div className={ styles.main }>
        {
            list.map((item: any) => {
                return <div className={ styles.follower } key={item.address}>
                    <div className={ styles.followerContent } onClick={() => {
                        router.push('/profile/user?account=' + item.address)
                    }}>
                        <img className={ styles.img } src={ item.icon || defaultAvatar } />
                        <div className={ styles.nameContent }>
                            <div className={ styles.name }>{ item.name || formatAddress(item.address) }</div>
                            <div className={ styles.followers }>{ item.followers } followers</div>
                        </div>
                    </div>

                    <div className={ styles.followerAction }>
                        {
                            userInfo.address === item.address ? <div className={ styles.me }>It{"'"}s me</div> : <FollowBtn address={ item.address } isFollower={item.isFoller}  onSuccess={() => {
                                onAction && onAction()
                            }}/>
                        }
                        
                    </div>
                </div>
            })
        }

        {
            (!list || list.length === 0) && <Empty description="No Data"/>
        }
    </div>
}
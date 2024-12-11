import type { UserInfo } from '@/app/type'
import styles from './follow.module.css'
import useFollow from '../../../hooks/useFollow';
import { formatAddress } from '@/app/utils';
import { useRouter } from 'next/navigation';
import FollowBtn from '../../../components/followBtn';

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
    const { unFollow, follow } = useFollow()
    const router = useRouter()

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
                        <FollowBtn address={ item.address } isFollower={!item.is_follower}  onSuccess={() => {}}/>
                        {/* {
                            item.is_follower
                            ? <div onClick={async () => {
                                await follow(item.address)
                                onAction && onAction()
                            }} className={ styles.followBtn + ' ' + styles.follow }>Follow</div> 
                            : <div onClick={async () => {
                                await unFollow(item.address)
                                onAction && onAction()
                            }} className={ styles.followBtn + ' ' + styles.following }>Following</div>
                        } */}
                    </div>
                </div>
            })
        }
    </div>
}
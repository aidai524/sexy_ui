import type { UserInfo } from '@/app/type'
import styles from './follow.module.css'
import useFollow from '../../../hooks/useFollow';

interface Props {
    list: UserInfo[];
    followerType: number;
    onAction?: () => void;
}

export default function  FollowerList({
    list,
    followerType,
    onAction,
}: Props) {
    const { unFollow, follow } = useFollow()

    return <div className={ styles.main }>
        {
            list.map((item: any) => {
                return <div className={ styles.follower } key={item.address}>
                    <div className={ styles.followerContent }>
                        <img className={ styles.img } src={ item.icon } />
                        <div className={ styles.nameContent }>
                            <div className={ styles.name }>{ item.name }</div>
                            <div className={ styles.followers }>{ item.followers } followers</div>
                        </div>
                    </div>

                    <div className={ styles.followerAction }>
                        {
                            item.is_follower
                            ? <div onClick={async () => {
                                await follow(item.address)
                                onAction && onAction()
                            }} className={ styles.followBtn + ' ' + styles.follow }>Follow</div> 
                            : <div onClick={async () => {
                                await unFollow(item.address)
                                onAction && onAction()
                            }} className={ styles.followBtn + ' ' + styles.following }>Following</div>
                        }
                    </div>
                </div>
            })
        }
    </div>
}
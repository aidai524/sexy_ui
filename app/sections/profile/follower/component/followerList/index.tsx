import type { UserInfo } from '@/app/type'
import styles from './follow.module.css'
import useFollow from '../../../hooks/useFollow';

interface Props {
    list: UserInfo[];
    followerType: number;
}

export default function  FollowerList({
    list,
    followerType,
}: Props) {
    const { unFollow } = useFollow()

    return <div className={ styles.main }>
        {
            list.map(item => {
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
                            followerType === 1
                            ? <div className={ styles.followBtn + ' ' + styles.follow }>Follow</div> 
                            : <div onClick={() => {
                                unFollow(item.address)
                            }} className={ styles.followBtn + ' ' + styles.following }>Following</div>
                        }
                        
                    </div>
                </div>
            })
        }
    </div>
}
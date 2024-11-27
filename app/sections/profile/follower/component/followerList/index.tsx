import styles from './follow.module.css'

const list = [1,2,3,4]

export default function FollowerList() {
    return <div className={ styles.main }>
        {
            list.map(item => {
                return <div className={ styles.follower } key={item}>
                    <div className={ styles.followerContent }>
                        <img className={ styles.img } src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
                        <div className={ styles.nameContent }>
                            <div className={ styles.name }>HooA8n</div>
                            <div className={ styles.followers }>45 followers</div>
                        </div>
                    </div>

                    <div className={ styles.followerAction }>
                        {
                            item % 2 === 0 
                            ? <div className={ styles.followBtn + ' ' + styles.follow }>Follow</div> 
                            : <div className={ styles.followBtn + ' ' + styles.following }>Following</div>
                        }
                        
                    </div>
                </div>
            })
        }
    </div>
}
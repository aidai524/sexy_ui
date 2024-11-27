import styles from './limitProject.module.css'

const list = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,330]

export default function LimitProject() {
    return <div className={ styles.main }>
        {
            list.slice(0, 5).map(item => {
                return <img className={ styles.img } key={item} src="https://pump.mypinata.cloud/ipfs/QmNTApMWbitxnQci6pqnZJXTZYGkmXdBew3MNT2pD8hEG6?img-width=128&img-dpr=2&img-onerror=redirect" />
            })
        }
        {
            list.length > 5 && <div className={ styles.more }>+{ list.length - 5 }</div>
        }
    </div>
}
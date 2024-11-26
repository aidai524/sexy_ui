import Token from "../token"

const list = [1, 2, 3, 4]

export default function Created() {
    return <div>
        {
            list.map(item => {
                return <Token key={item} />
            })
        }
    </div>
}
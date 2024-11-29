import { Button } from "antd-mobile";

export default function MainBtn({ children, onClick, style }: {
    children: React.ReactNode;
    onClick?: () => void;
    style?: any
}) {
    return <Button style={style} onClick={onClick} className="main-btn">{ children }</Button>
}
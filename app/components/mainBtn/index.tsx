import { Button } from "antd-mobile";

export default function MainBtn({ children, onClick }: {
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return <Button onClick={onClick} className="main-btn">{ children }</Button>
}
import { Button } from "antd-mobile";

export default function MainBtn({ children, onClick, style, isLoading = false, isDisabled = false}: {
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    isDisabled?: boolean;
    style?: any
}) {
    return <Button disabled={isDisabled} loading={isLoading} style={style} onClick={onClick} className="main-btn">{ children }</Button>
}
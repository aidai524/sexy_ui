import CommentComp from "@/app/components/comment";
import useCommentList from "@/app/hooks/use-comment-list";
import type { Project } from "@/app/type";
import styles from "./index.module.css";

interface Props {
    token: Project;
}

export default function CommnentList({ token }: Props) {
    const comments = useCommentList({ id: token?.id });  
    return <div className={ styles.main }>
        <CommentComp usePanel={false}  id={token.id} {...comments} />
    </div>
}
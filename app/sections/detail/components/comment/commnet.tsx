import CommentComp from "@/app/components/comment";
import useCommentList from "@/app/hooks/use-comment-list";
import type { Project } from "@/app/type";
import styles from "./index.module.css";

export default function CommnentList({ token, onSuccess }: any) {
  const comments = useCommentList({ id: token?.id });
  return (
    <div className={styles.main}>
      <CommentComp
        usePanel={false}
        id={token.id}
        {...comments}
        token={token}
        onSuccess={onSuccess}
      />
    </div>
  );
}

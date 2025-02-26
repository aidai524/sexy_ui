import CommentComp from "@/app/components/comment";
import useCommentList from "@/app/hooks/use-comment-list";

export default function CommentsPanel({ token, onSuccess }: any) {
  const comments = useCommentList({ id: token?.id });
  return (
    <CommentComp
      from="panel"
      id={token?.id}
      token={token}
      {...comments}
      onSuccess={onSuccess}
      isPreview={false}
      theme="light"
      usePanel={false}
      titleStyle={{
        fontSize: 12,
        color: "#FFFFFF99"
      }}
    />
  );
}

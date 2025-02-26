import CommentComp from "@/app/components/comment";

export default function CommentsPanel({ token, onSuccess }: any) {
  return (
    <CommentComp
      from="panel"
      token={token}
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

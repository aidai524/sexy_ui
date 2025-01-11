import { useCallback, useState } from "react";
import { useAuth } from "../context/auth";
import { httpAuthPost } from "@/app/utils";

export default function useComment(id: number, onSuccess: VoidFunction) {
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { userInfo } = useAuth();

  const onPostComment = useCallback(async () => {
    if (!userInfo?.address) {
      window?.connect();
      return;
    }
    if (isLoading || !commentText) return;
    try {
      setIsLoading(true);
      const response = await httpAuthPost(
        `/project/comment?project_id=${id}&text=${commentText}`
      );
      if (response.code === 0) {
        onSuccess();
        setCommentText("");
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [id, commentText, isLoading]);

  return {
    isLoading,
    commentText,
    setCommentText,
    onPostComment
  };
}

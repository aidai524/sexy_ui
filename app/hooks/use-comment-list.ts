import { useState, useCallback, useEffect } from "react";
import { httpGet } from "@/app/utils";
import { useDebounceFn } from "ahooks";

export default function useCommentList({ id, limit = 10 }: any) {
  const [commentList, setCommentList] = useState<any[]>([]);
  const [isCommentLoading, setIsCommentLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [commentHasMore, setCommentHasMore] = useState(true);

  const loadMoreComment = useCallback(
    (newOffset?: number) => {
      if (!id) return;
      const _offset = typeof newOffset === "number" ? newOffset : offset;

      if (_offset === 0) setIsCommentLoading(true);
      if (_offset !== 0 && !commentHasMore) {
        setIsCommentLoading(false);
        return Promise.resolve();
      }
      return httpGet("/project/comment/list", {
        limit: 10,
        project_id: id,
        offset: _offset
      })
        .then((res) => {
          if (_offset === 0) setIsCommentLoading(false);
          if (res?.code !== 0) throw new Error();
          setCommentHasMore(res.data?.has_next_page || false);
          let newList = [];
          if (res.data.list?.length) {
            const newMapList = res.data.list.map((item: any) => {
              return mapDataToComment(item);
            });

            if (_offset === 0) {
              newList = newMapList;
            } else {
              newList = [...commentList, ...newMapList];
            }
          }
          setOffset(newList.length);
          setCommentList(newList);
        })
        .catch((err) => {
          if (_offset === 0) {
            setIsCommentLoading(false);
            setCommentList([]);
          }
        });
    },
    [id, offset, commentHasMore]
  );

  const { run: loadData } = useDebounceFn(
    (args: any = {}) => {
      if (!id) {
        setCommentList([]);
      } else {
        loadMoreComment(0);
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    loadData();
  }, [id]);

  return {
    isCommentLoading,
    commentHasMore,
    loadMoreComment,
    commentList
  };
}

function mapDataToComment(data: any): any {
  return {
    address: data.address,
    projectId: data.project_id,
    text: data.text,
    id: data.id,
    isLike: data.is_like,
    isUnlike: data.is_unlike,
    like: data.like,
    unLike: data.un_like,
    time: data.time,
    creater: data.account_data
  };
}

import { useRef, useState } from "react";
import { httpAuthGet } from "../utils";

const LIMIT = 10;
export default function useSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const prevSearchText = useRef("");

  const onSearch = async (text?: string) => {
    try {
      if (text) {
        pageRef.current = 1;
      }
      setIsLoading(true);
      prevSearchText.current = text || searchText;
      const response = await httpAuthGet("/project/search", {
        limit: LIMIT,
        offset: (pageRef.current - 1) * LIMIT,
        text: text || searchText
      });
      if ((text || searchText) !== prevSearchText.current) return;
      pageRef.current === 1
        ? setList(response.data.list || [])
        : setList([...list, ...(response.data.list || [])]);
      setHasMore(response.data?.list.length === LIMIT);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const onNextPage = async () => {
    if (isLoading || !hasMore) {
      return;
    }
    pageRef.current = pageRef.current + 1;
    await onSearch();
  };

  const onClear = () => {
    pageRef.current = 1;
    setList([]);
    setHasMore(true);
    setSearchText("");
  };

  return {
    list,
    isLoading,
    searchText,
    hasMore,
    pageRef,
    setIsLoading,
    setSearchText,
    onSearch,
    onNextPage,
    onClear
  };
}

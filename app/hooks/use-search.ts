import { useCallback, useRef, useState } from "react";
import { httpAuthGet } from "../utils";

const LIMIT = 10;
export default function useSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<any>([]);
  const [searchText, setSearchText] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);

  const onSearch = useCallback(async (text?: string) => {
    try {
      setIsLoading(true);
      const response = await httpAuthGet("/project/search", {
        limit: LIMIT,
        offset: offsetRef.current,
        text: text || searchText
      });
      console.log(response);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onNextPage = () => {
    if (!hasMore) {
      return;
    }
    offsetRef.current = offsetRef.current + 1;
    onSearch();
  };

  return {
    list,
    isLoading,
    searchText,
    setSearchText,
    onSearch,
    onNextPage
  };
}

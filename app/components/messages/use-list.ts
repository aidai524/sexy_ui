import { useCallback, useEffect, useRef, useState } from "react";
import { httpAuthGet } from "@/app/utils";

const PAGE_SIZE = 50;

export default function useList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await httpAuthGet(
        `/inform/list?limit=${PAGE_SIZE}&offset=${
          (pageRef.current - 1) * PAGE_SIZE
        }`
      );
      setList(response.data);
    } catch (err) {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onNextPage = () => {
    pageRef.current = pageRef.current + 1;
    onQuery();
  };

  useEffect(() => {
    onQuery();
  }, []);

  return {
    list,
    loading,
    onQuery,
    onNextPage
  };
}

import { useEffect, useState } from 'react';
import { httpAuthGet } from '@/app/utils';

export function useTrends() {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await httpAuthGet(`/project/trends/list`, {});
      const _list = res.data || [];
      setList(_list);
      setLoading(false);
    } catch (err) {
      console.log('get trends list err: %o', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return {
    list,
    loading,
  };
}

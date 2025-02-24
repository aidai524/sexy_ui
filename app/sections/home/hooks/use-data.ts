import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { useProjects, type Type } from "@/app/store/use-projects-new";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";
import { useAccount } from "@/app/hooks/useAccount";

const limit = 10;
const left_num = 5;

export default function useData(launchType: Type) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [refresher, setRefresher] = useState(0);
  const { accountRefresher } = useAuth();
  const projectsStore = useProjects();
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);
  const prePageRef = useRef<any>([]);
  const { address } = useAccount();

  const queryList = async () => {
    if (fetchingRef.current) return;
    try {
      fetchingRef.current = true;

      if (address && prePageRef.current.length) {
        const res = await httpGet(
          "/project/ids?id_list=" + prePageRef.current.join(",")
        );
        projectsStore.setProjects(res.data, address);
        projectsStore.setList(launchType, prePageRef.current, true);
        setHasNext(true);
        prePageRef.current = [];
        return;
      }

      const cachedList = projectsStore.getList(launchType);
      const res = await httpGet(
        `/project/list?limit=${limit}&launchType=${
          launchType === "other" ? "video" : launchType
        }&deleteCache=${Object.keys(cachedList).length === 0}${
          address && prePageRef.current.length
            ? "&addIDList=" + prePageRef.current.join(",")
            : ""
        }`
      );

      if (res.code !== 0 || !res.data?.list) {
        return [];
      }
      const ids = res.data?.list.map((item: any) => item.id) || [];

      projectsStore.setProjects(res.data?.list, address);

      projectsStore.setList(
        launchType,
        ids,
        launchType === "forYou" && !hasNext
      );
      if (!address) {
        prePageRef.current = ids;
      } else {
        prePageRef.current = [];
      }

      const _hasNext = res.data?.list && res.data?.list.length === limit;
      setHasNext(_hasNext);
    } catch (err) {
    } finally {
      fetchingRef.current = false;
    }
  };

  const handleList = async (isNext?: boolean) => {
    if (!isNext) setIsLoading(true);
    await queryList();
    const _list = projectsStore.getList(launchType) || [];
    setIsLoading(false);
  };

  const initList: any = () => {
    let _list = projectsStore.getList(launchType) || [];

    if (_list.length === 0) {
      handleList(false);
      return;
    }

    if (_list.length - projectsStore.getIndex(launchType) > left_num) {
      setIsLoading(false);
      return;
    }
    if (launchType === "forYou") {
      handleList(true);
      return;
    }
    if (hasNext) {
      handleList(true);
    }
  };

  const queryAndUpdateDetail = useCallback(
    async (address: number) => {
      const res = await httpGet(`/project?address=${address}`);
      if (res.code !== 0 || !res.data || !res.data.length) return;
      projectsStore.updateProject(res.data[0]);
      setRefresher(refresher + 1);
    },
    [projectsStore, refresher]
  );

  const onChangeIndex = (currentIndex: number) => {
    projectsStore.setIndex(launchType, currentIndex);
    const list = projectsStore.getList(launchType);
    if (list.length - projectsStore.getIndex(launchType) > left_num) {
      return;
    }
    if (launchType === "forYou") {
      handleList(true);
      return;
    }
    if (hasNext) {
      handleList(true);
    }
  };

  const { run: debounceList } = useDebounceFn(
    () => {
      projectsStore.clearList(launchType);
      projectsStore.clearProjects();
      if (projectsStore.address) {
        projectsStore.setIndex(launchType, 0);
      }
      setIsLoading(true);

      initList();
      mountedRef.current = true;
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!mountedRef.current) return;

    initList();
  }, []);

  useEffect(() => {
    debounceList();
  }, [accountRefresher]);

  return {
    getIndex: projectsStore.getIndex,
    isLoading,
    getList: projectsStore.getList,
    hasNext,
    refresher,
    updateProject: projectsStore.updateProject,
    onChangeIndex,
    getProjectById: projectsStore.getProjectById,
    queryAndUpdateDetail
  };
}

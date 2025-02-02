import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { useProjects, type Type } from "@/app/store/use-projects";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";
import { mapDataToProject } from "@/app/utils/mapTo";

const limit = 10;
const left_num = 5;

function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
}

export default function useData(launchType: Type) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [list, setList] = useState<number[]>([]);
  const [refresher, setRefresher] = useState(0);
  const { accountRefresher, userInfo } = useAuth();
  const projectsStore = useProjects();
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);

  const queryList = async () => {
    if (fetchingRef.current) return;
    try {
      fetchingRef.current = true;
      const res = await httpGet(
        `/project/list?limit=${limit}&launchType=${launchType}`
      );

      const _hasNext = res.data?.list && res.data?.list.length === limit;
      setHasNext(_hasNext);

      if (res.code !== 0 || !res.data?.list) {
        return [];
      }

      const icons = res.data?.list.map((token: any) => token.icon);
      preloadImages(icons);

      const projects = res.data?.list.map((item: any, i: number) => ({
        ...mapDataToProject(item),
        fetched_time: Date.now() + i
      }));

      projectsStore.setProjects(
        projects,
        launchType,
        _hasNext,
        userInfo?.address
      );
    } catch (err) {
    } finally {
      fetchingRef.current = false;
    }
  };

  const handleList = useCallback(
    async (isNext?: boolean) => {
      if (!isNext) setIsLoading(true);
      await queryList();
      const _list =
        projectsStore.getProjectsByType(launchType, list.length === 0) || [];
      setList(_list);
      setIsLoading(false);
    },
    [launchType, userInfo]
  );

  const initList = () => {
    let _list =
      projectsStore.getProjectsByType(launchType, list.length === 0) || [];

    if (_list.length === 0) {
      handleList(false);
      return;
    }

    setList(_list);

    if (_list.length - projectsStore.getIndex(launchType) > left_num) {
      setIsLoading(false);
      return;
    }
    if (launchType === "launching") {
      handleList(true);
      return;
    }

    if (launchType === "preLaunch" && hasNext) {
      handleList(true);
    }
  };

  const queryAndUpdateDetail = useCallback(
    async (type: Type, address: number) => {
      const res = await httpGet(`/project?address=${address}`);
      if (res.code !== 0 || !res.data || !res.data.length) return;
      projectsStore.updateProject(type, mapDataToProject(res.data[0]));
      setRefresher(refresher + 1);
    },
    [projectsStore, refresher]
  );

  const onChangeIndex = (currentIndex: number) => {
    projectsStore.setIndex(launchType, currentIndex);
    if (list.length - projectsStore.getIndex(launchType) > left_num) {
      return;
    }
    if (launchType === "launching") {
      handleList(true);
      return;
    }

    if (launchType === "preLaunch" && hasNext) {
      handleList(true);
    }
  };

  const { run: debounceList } = useDebounceFn(
    () => {
      if (projectsStore.address !== (userInfo?.address || "")) {
        projectsStore.clear(launchType);
        projectsStore.setIndex(launchType, 0);
        setList([]);
      }

      initList();
      mountedRef.current = true;
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!mountedRef.current) return;
    initList();
  }, [launchType]);

  useEffect(() => {
    debounceList();
  }, [accountRefresher]);

  return {
    getIndex: projectsStore.getIndex,
    isLoading,
    list,
    hasNext,
    refresher,
    updateProject: projectsStore.updateProject,
    onChangeIndex,
    getProjectById: projectsStore.getProjectById,
    queryAndUpdateDetail
  };
}

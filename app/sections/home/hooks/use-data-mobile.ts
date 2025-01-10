import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/app/type";
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
  const { accountRefresher, userInfo } = useAuth();
  const projectsStore = useProjects();
  const mountedRef = useRef(false);

  const queryList = async () => {
    try {
      const res = await httpGet(
        `/project/list?limit=${limit}&launchType=${launchType}`
      );
      setHasNext(res.data?.list.length === limit);
      if (res.code !== 0 || !res.data?.list) {
        return [];
      }
      const icons = res.data?.list.map((token: any) => token.icon);
      preloadImages(icons);

      const projects = res.data?.list.map((item: any) => ({
        ...mapDataToProject(item),
        fetched_time: Date.now()
      }));

      projectsStore.setProjects(projects, launchType);
    } catch (err) {}
  };

  const handleList = useCallback(
    async (isNext?: boolean) => {
      if (!isNext) setIsLoading(true);
      await queryList();
      const list = projectsStore.getProjectsByType(launchType) || [];
      setList(list);
      setIsLoading(false);
    },
    [launchType, userInfo]
  );

  const initList = () => {
    let list = projectsStore.getProjectsByType(launchType) || [];
    if (list.length === 0) {
      handleList(false);
      return;
    }
    setList(list);

    if (
      list.length - projectsStore.getIndex(launchType) <= left_num &&
      hasNext
    ) {
      handleList(true);
    } else {
      setIsLoading(false);
    }
  };

  const onChangeIndex = (currentIndex: number) => {
    projectsStore.setIndex(launchType, currentIndex);

    if (
      list.length - projectsStore.getIndex(launchType) <= left_num &&
      hasNext
    ) {
      handleList(true);
    }
  };

  const { run: debounceList } = useDebounceFn(
    () => {
      initList();
      mountedRef.current = true;
      if (window?.sexAddress !== userInfo.address) {
        projectsStore.clear(launchType);
      }
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
    hasNext,
    isLoading,
    list,
    updateProject: projectsStore.updateProject,
    onChangeIndex,
    getProjectById: projectsStore.getProjectById
  };
}

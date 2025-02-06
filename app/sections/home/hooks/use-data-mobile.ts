import { httpGet } from "@/app/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { useProjects, type Type } from "@/app/store/use-projects";
import { useAuth } from "@/app/context/auth";
import { useDebounceFn } from "ahooks";
import { usePathname } from "next/navigation";
import { useAccount } from "@/app/hooks/useAccount";
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
  const { accountRefresher } = useAuth();
  const projectsStore = useProjects();
  const mountedRef = useRef(false);
  const fetchingRef = useRef(false);
  const pathname = usePathname();
  const { address } = useAccount();

  const queryList = async () => {
    if (fetchingRef.current) return;
    try {
      fetchingRef.current = true;
      const cachedList = projectsStore.getProjectsByType(launchType) || [];
      const res = await httpGet(
        `/project/list?limit=${limit}&launchType=${launchType}&deleteCache=${
          cachedList.length === 0
        }`
      );

      const _hasNext = res.data?.list && res.data?.list.length === limit;
      setHasNext(_hasNext);

      if (res.code !== 0 || !res.data?.list) {
        return [];
      }

      const icons = res.data?.list.map((token: any) => token.icon);
      preloadImages(icons);

      projectsStore.setProjects(res.data?.list, launchType, _hasNext, address);
    } catch (err) {
    } finally {
      fetchingRef.current = false;
    }
  };

  const handleList = async (isNext?: boolean) => {
    if (!isNext) setIsLoading(true);
    await queryList();
    const _list = projectsStore.getProjectsByType(launchType) || [];

    setList(_list);
    setIsLoading(false);
  };

  const initList = () => {
    let _list = projectsStore.getProjectsByType(launchType) || [];

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
      if (type === "preLaunch" && res.data[0].status !== 0) {
        const findIndex = list.findIndex((item) => item === res.data[0].id);
        if (findIndex !== -1) {
          list.splice(findIndex, 1);
          setList(JSON.parse(JSON.stringify(list)));
        }
      }
      projectsStore.updateProject(type, mapDataToProject(res.data[0]));
      setRefresher(refresher + 1);
    },
    [projectsStore, refresher]
  );

  const checkedFetchedTime = () => {
    const time =
      launchType === "preLaunch"
        ? projectsStore.preTime
        : projectsStore.launchTime;
    if (time + 1000 * 60 * 60 > Date.now()) return false;
    projectsStore.clear(launchType);
    handleList(false);
    return true;
  };

  const onChangeIndex = (currentIndex: number) => {
    const res = checkedFetchedTime();
    if (res) return;
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
      console.log("projectsStore.address", projectsStore.address);
      console.log("address", address);
      if (projectsStore.address !== (address || "")) {
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
    const res = checkedFetchedTime();
    if (res) return;
    initList();
  }, [launchType]);

  useEffect(() => {
    debounceList();
  }, [accountRefresher]);

  useEffect(() => {
    checkedFetchedTime();
  }, [pathname]);

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

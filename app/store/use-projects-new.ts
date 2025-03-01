import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mapDataToProject } from "../utils/mapTo";
import mediaStore from "../libs/media-store";
import { videoReg } from "@/app/components/upload";
import { httpGet } from "@/app/utils";
import { uniq } from "lodash-es";

export enum LaunchType {
  forYou = "forYou",
  genesis = "genesis",
  ticking = "ticking",
  listed = "listed",
  other = "other"
}

export type Type = keyof typeof LaunchType;

interface ProjectsState {
  projects: {};
  forYouIndex: number;
  genesisIndex: number;
  tickingIndex: number;
  listedIndex: number;
  otherIndex: number;
  forYouList: any[];
  genesisList: any[];
  tickingList: any[];
  listedList: any[];
  otherList: any[];
  address: string;
  setProjects: (projects: any, address?: string) => void;
  updateProject: (item: any) => void;
  getProjectById: (id: number) => any;
  getIndex: (type: Type) => number;
  setIndex: (type: Type, index: number) => void;
  getList: (type: Type) => any[];
  setList: (type: Type, list: any[], reset: boolean) => void;
  clearList: (type: Type) => void;
  clearProjects: () => void;
}

const init = {
  projects: {},
  forYouIndex: 0,
  genesisIndex: 0,
  tickingIndex: 0,
  listedIndex: 0,
  otherIndex: 0,
  forYouList: [],
  genesisList: [],
  tickingList: [],
  listedList: [],
  otherList: []
};

export const useProjects = create(
  persist<ProjectsState>(
    (set, get: any) => ({
      ...init,
      address: "",
      setProjects: (_projects: any, address?: string) => {
        if (!_projects.length) return;
        const currentProjects = get().projects;

        const projects = _projects
          .filter((item: any) => !currentProjects[item.id])
          .map((item: any, i: number) => {
            return {
              ...mapDataToProject(item),
              fetched_time: Date.now() + i
            };
          });

        const list = {
          ...currentProjects,
          ...projects.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.id]: curr }),
            {}
          )
        };

        set({
          projects: list,
          address: address || ""
        });
      },
      updateProject: (item: any) => {
        const currentProjects = get().projects;

        if (!currentProjects[item.id]) return;

        currentProjects[item.id] = {
          ...mapDataToProject(item),
          fetched_time: Date.now()
        };

        set({ projects: currentProjects });
      },
      getProjectById: (id: number) => {
        const currentProjects = get().projects;

        return currentProjects[id];
      },
      setIndex: async (type: Type, index: number) => {
        const list = get()[type + "List"];
        const startI = index - 10 < 0 ? 0 : index - 10;
        const endI =
          index + 10 > list.length - 1 ? list.length - 1 : index + 10;

        const availableProjects = list.slice(startI, endI);

        const cachedVideos: any = [];
        const needUpdateProjects: any = [];
        availableProjects.forEach((item: any) => {
          if (item.video && videoReg.test(item.video)) {
            cachedVideos.push({
              url: item.video,
              name: item.id
            });
          }
          if (Date.now() - item.fetched_time > 10 * 60 * 60 * 1000) {
            needUpdateProjects.push(item.id);
          }
        });

        mediaStore.fetchFiles(cachedVideos);

        set({ [type + "Index"]: index });

        if (needUpdateProjects.length > 0) {
          const res = await httpGet(
            "/project/ids?id_list=" + needUpdateProjects.join(",")
          );
          const currentProjects = get().projects;
          let repeatCount = 0;
          res.data?.forEach((item: any) => {
            const currentItem = currentProjects[item.id];
            if (!currentItem) return;
            if (item.status !== currentItem) {
              const i = list.find((slip: any) => slip === item.id);
              repeatCount++;
              list.splice(i, 1);
            }
            currentProjects[item.id] = {
              ...mapDataToProject(item),
              fetched_time: Date.now()
            };
          });
          if (repeatCount > 0) {
            set({
              [type + "List"]: [...list],
              [type + "Index"]: index - repeatCount
            });
          }
          set({ projects: currentProjects });
        }
      },
      getIndex(type: Type) {
        return get()[type + "Index"];
      },
      getList(type: Type) {
        return get()[type + "List"];
      },
      setList(type: Type, list: any[], reset: boolean) {
        const _list = get()[type + "List"];
        set({
          [type + "List"]: uniq(reset ? list : [..._list, ...list])
        });
      },
      clearList(type: Type) {
        set({ [type + "List"]: [] });
      },
      clearProjects() {
        set({
          projects: {}
        });
      }
    }),
    {
      name: "_projects",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

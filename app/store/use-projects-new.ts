import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mapDataToProject } from "../utils/mapTo";

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
  clear: () => void;
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
          .map((item: any, i: number) => ({
            ...mapDataToProject(item),
            fetched_time: Date.now()
          }));

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
      setIndex(type: Type, index: number) {
        set({ [type + "Index"]: index });
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
          [type + "List"]: [..._list, ...list]
        });
      },
      clear() {
        set({ ...init });
      }
    }),
    {
      name: "_projects",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);

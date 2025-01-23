import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mapDataToProject } from "../utils/mapTo";

const TIME_DURATION = 1000 * 60 * 60;

export type Type = "preLaunch" | "launching";

interface ProjectsState {
  preProjects: {};
  launchProjects: {};
  preIndex: number;
  launchIndex: number;
  address: string;
  setProjects: (
    projects: any,
    type: Type,
    hasMore: boolean,
    address?: string
  ) => void;
  getProjectsByType: (type: Type, isEmpty: boolean) => any[];
  updateProject: (type: Type, item: any) => void;
  clear: (type: Type) => void;
  getProjectById: (type: Type, id: number) => any;
  getIndex: (type: Type) => number;
  setIndex: (type: Type, index: number) => void;
}

export const useProjects = create(
  persist<ProjectsState>(
    (set, get: any) => ({
      preProjects: {},
      launchProjects: {},
      preIndex: 0,
      launchIndex: 0,
      address: "",
      clear: (type: Type) => {
        if (type === "preLaunch") {
          set({ preProjects: {}, preIndex: 0 });
        } else {
          set({ launchProjects: {}, launchIndex: 0 });
        }
      },
      setProjects: (
        _projects: any,
        type: Type,
        hasMore: boolean,
        address?: string
      ) => {
        const currentProjects =
          type === "preLaunch" ? get().preProjects : get().launchProjects;

        let prev: any = {};

        if (type === "preLaunch") {
          prev = { ...currentProjects };
        }

        if (type === "launching") {
          prev = hasMore ? { ...currentProjects } : {};
        }

        const list = {
          ...prev,
          ..._projects.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.id]: curr }),
            {}
          )
        };

        if (type === "preLaunch") {
          set({ preProjects: list, address: address || "" });
        } else {
          set({
            launchProjects: list,
            address: address || ""
          });
        }
      },
      getProjectsByType: (type: Type, isEmpty: boolean) => {
        const currentProjects = Object.values(
          type === "preLaunch" ? get().preProjects : get().launchProjects
        );

        const filteredProjects = currentProjects.filter(
          (project: any) => Date.now() - project.fetched_time < TIME_DURATION
        );

        if (isEmpty) {
          const mapList: any = filteredProjects.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.id]: curr }),
            {}
          );
          type === "preLaunch"
            ? set({ preProjects: mapList, preIndex: 0 })
            : set({ launchProjects: mapList, launchIndex: 0 });
        }

        return filteredProjects
          .sort((a: any, b: any) => a.fetched_time - b.fetched_time)
          .map((project: any) => project.id);
      },
      updateProject: (type: Type, item: any) => {
        const currentProjects =
          type === "preLaunch" ? get().preProjects : get().launchProjects;
        if (!currentProjects[item.id]) return;
        currentProjects[item.id] = {
          ...mapDataToProject(item),
          fetched_time: currentProjects[item.id].fetched_time
        };
        if (type === "preLaunch") {
          set({ preProjects: currentProjects });
        } else {
          set({ launchProjects: currentProjects });
        }
      },
      getProjectById: (type: Type, id: number) => {
        const currentProjects =
          type === "preLaunch" ? get().preProjects : get().launchProjects;

        return currentProjects[id];
      },
      setIndex(type: Type, index: number) {
        if (type === "preLaunch") {
          set({ preIndex: index });
        } else {
          set({ launchIndex: index });
        }
      },
      getIndex(type: Type) {
        if (type === "preLaunch") {
          return get().preIndex;
        } else {
          return get().launchIndex;
        }
      }
    }),
    {
      name: "_projects",
      version: 0.11,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

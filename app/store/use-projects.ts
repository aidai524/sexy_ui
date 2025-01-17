import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  getProjectsByType: (type: Type) => any[];
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
      getProjectsByType: (type: Type) => {
        const currentProjects = Object.values(
          type === "preLaunch" ? get().preProjects : get().launchProjects
        );

        return currentProjects
          .filter(
            (project: any) => Date.now() - project.fetched_time < TIME_DURATION
          )
          .map((project: any) => project.id);
      },
      updateProject: (type: Type, item: any) => {
        const currentProjects =
          type === "preLaunch" ? get().preProjects : get().launchProjects;
        if (!currentProjects[item.id]) return;
        currentProjects[item.id] = item;
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
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

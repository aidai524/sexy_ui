import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const TIME_DURATION = 1000 * 60 * 60;

export type Type = "preLaunch" | "launching";

interface ProjectsState {
  preProjects: {};
  launchProjects: {};
  preIndex: number;
  launchIndex: number;
  setProjects: (projects: any, type: Type) => void;
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
      clear: (type: Type) => {
        if (type === "preLaunch") {
          set({ preProjects: {} });
        } else {
          set({ launchProjects: {} });
        }
      },
      setProjects: (_projects: any, type: Type) => {
        const currentProjects =
          type === "preLaunch" ? get().preProjects : get().launchProjects;
        const currentProjectsList = Object.values(
          type === "preLaunch" ? get().preProjects : get().launchProjects
        );
        let prev: any = {};
        if (currentProjectsList.length + _projects.length > 100) {
          const start = currentProjectsList.length + _projects.length - 100;
          prev = currentProjectsList
            .slice(start, 100)
            .reduce((acc: any, curr: any) => ({ ...acc, [curr.id]: curr }), {});
        } else {
          prev = { ...currentProjects };
        }

        const list = {
          ...prev,
          ..._projects.reduce(
            (acc: any, curr: any) => ({ ...acc, [curr.id]: curr }),
            {}
          )
        };
        if (type === "preLaunch") {
          set({ preProjects: list });
        } else {
          set({ launchProjects: list });
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
      version: 0.2,
      storage: createJSONStorage(() => localStorage)
    }
  )
);

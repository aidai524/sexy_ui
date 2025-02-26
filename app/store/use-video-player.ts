import { create } from "zustand";

interface VideoPlayerState {
  isPlay: boolean;
  autoPlay: boolean;
  prevId: string;
  setPlay: (isPlay: boolean, id: string) => void;
  setAutoPlay: (isAutoPlay: boolean) => void;
}

export const useVideoPlayer = create<VideoPlayerState>((set, get) => ({
  isPlay: false,
  autoPlay: false,
  prevId: "",
  setAutoPlay: (autoPlay: boolean) => {
    set({ autoPlay });
  },
  setPlay: (isPlay, id) => {
    const prevId = get().prevId;

    if (prevId !== id && prevId) {
      const prevVideo = document.getElementById(prevId) as HTMLVideoElement;

      prevVideo?.pause();
    }

    if (id) {
      const currentVideo = document.getElementById(id) as HTMLVideoElement;
      isPlay ? currentVideo?.play() : currentVideo?.pause();

      set({ prevId: id });
    }

    set({ isPlay });
  }
}));

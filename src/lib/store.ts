import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Bookmark {
  id: number;
  title: string;
  poster: string;
  lastEpisode?: number;
}

export interface HistoryEntry {
  id: number;
  title: string;
  poster: string;
  episode: number;
  timestamp: number;
}

interface State {
  bookmarks: Bookmark[];
  history: HistoryEntry[];
  toggleBookmark: (b: Bookmark) => void;
  isBookmarked: (id: number) => boolean;
  recordWatch: (h: HistoryEntry) => void;
  removeHistory: (id: number) => void;
  clearHistory: () => void;
}

export const useLibrary = create<State>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      history: [],
      toggleBookmark: (b) => {
        const exists = get().bookmarks.some((x) => x.id === b.id);
        set({
          bookmarks: exists
            ? get().bookmarks.filter((x) => x.id !== b.id)
            : [b, ...get().bookmarks],
        });
      },
      isBookmarked: (id) => get().bookmarks.some((b) => b.id === id),
      recordWatch: (h) => {
        const filtered = get().history.filter((x) => x.id !== h.id);
        set({ history: [h, ...filtered].slice(0, 50) });
      },
      removeHistory: (id) =>
        set({ history: get().history.filter((h) => h.id !== id) }),
      clearHistory: () => set({ history: [] }),
    }),
    { name: "chidori-library" }
  )
);
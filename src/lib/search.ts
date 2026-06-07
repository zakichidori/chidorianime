import { apiFetch } from "./api";
import type { AnimeCard } from "./anime";

export async function quickSearch(name: string) {
  if (!name.trim()) return [];
  return apiFetch<AnimeCard[]>(`/api/search/${encodeURIComponent(name)}`);
}

export async function searchAll(name: string, page = 1) {
  return apiFetch<{ currentPage: number; AniData: AnimeCard[] }>(
    `/api/searchall/${encodeURIComponent(name)}?page=${page}`
  );
}

export interface SortOpts {
  name?: string;
  genre?: string;
  ratefrom?: number;
  rateto?: number;
  page?: number;
}

export async function sortAnime(opts: SortOpts = {}) {
  const p = new URLSearchParams();
  if (opts.name) p.set("name", opts.name);
  if (opts.genre) p.set("genre", opts.genre);
  if (opts.ratefrom !== undefined) p.set("ratefrom", String(opts.ratefrom));
  if (opts.rateto !== undefined) p.set("rateto", String(opts.rateto));
  if (opts.page) p.set("page", String(opts.page));
  const res = await apiFetch<[number, AnimeCard[]]>(`/api/sort?${p.toString()}`);
  return { totalPages: res[0], results: res[1] };
}
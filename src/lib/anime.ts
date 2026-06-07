import { apiFetch, fixImg } from "./api";

export interface AnimeInfo {
  _id: number;
  Name: string;
  ImagePath: string;
  Cover: string;
  Synonyms?: string;
  Aired?: string;
  Premiered?: string;
  Duration?: string;
  Status?: string;
  MALScore?: string;
  RatingsNum?: number;
  Genres?: string[];
  Studios?: string;
  Producers?: string;
  DescripTion?: string;
  epCount?: number;
  finder?: string;
}

export interface AnimeCard {
  _id?: number;
  Id?: number;
  Name: string;
  ImagePath?: string;
  Image?: string;
  MALScore?: string;
  RatingsNum?: number;
  DescripTion?: string;
  Genres?: string[];
  finder?: string;
  epCount?: number;
}

export const normalizeCard = (c: AnimeCard) => ({
  id: (c._id ?? c.Id) as number,
  name: c.Name,
  image: fixImg(c.ImagePath ?? c.Image),
  score: c.MALScore,
  finder: c.finder,
  genres: c.Genres,
  epCount: c.epCount,
});

export type NormalizedCard = ReturnType<typeof normalizeCard>;

export async function getAnimeInfo(idOrSlug: string | number): Promise<AnimeInfo> {
  const d = await apiFetch<AnimeInfo>(`/api/info/${idOrSlug}`);
  d.ImagePath = fixImg(d.ImagePath);
  d.Cover = fixImg(d.Cover);
  return d;
}

export async function getTotal(): Promise<number> {
  return apiFetch<number>("/api/getAll");
}

export async function getLastId(): Promise<number> {
  return apiFetch<number>("/api/getlast");
}

export async function findByGenre(genre: string, page = 1) {
  return apiFetch<{ currentPage: number; wholePage: AnimeCard[] }>(
    `/api/findbyGenre/${genre}?Page=${page}`
  );
}

export async function findByRating(page = 1) {
  return apiFetch<{ currentPage: number; AniData: AnimeCard[] }>(
    `/api/findbyrating?page=${page}`
  );
}

export async function findByName(name: string) {
  return apiFetch<{ exist: boolean; id?: number; ep?: number }>(
    `/api/find/${encodeURIComponent(name)}`
  );
}

export interface AnimeFullDetails {
  local: AnimeInfo;
  jikan?: any;
  characters?: Array<{
    character: { name: string; images?: { jpg?: { image_url?: string } } };
    role: string;
    voice_actors: Array<{
      person: { name: string; images?: { jpg?: { image_url?: string } } };
      language: string;
    }>;
  }>;
}

export async function getFullDetails(id: number | string): Promise<AnimeFullDetails> {
  const d = await apiFetch<AnimeFullDetails>(`/anime/api/details/${id}`);
  if (d.local) {
    d.local.ImagePath = fixImg(d.local.ImagePath);
    d.local.Cover = fixImg(d.local.Cover);
  }
  return d;
}
import { apiFetch, stripSrc } from "./api";

interface StreamRaw {
  local: {
    name: string;
    link: string;
    ep: Array<{ link: string }>;
  };
}

export interface Episode {
  number: number;
  src: string;
}

export async function getEpisodes(id: number | string): Promise<{
  name: string;
  episodes: Episode[];
}> {
  const d = await apiFetch<StreamRaw>(`/v1/api/details/${id}`);
  const eps: Episode[] = [];
  if (d.local?.link) eps.push({ number: 1, src: stripSrc(d.local.link) });
  (d.local?.ep ?? []).forEach((e, i) =>
    eps.push({ number: i + 2, src: stripSrc(e.link) })
  );
  return { name: d.local?.name ?? "", episodes: eps };
}
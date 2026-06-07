const ORIGIN = "https://anipub.xyz";

export const fixImg = (p?: string | null): string => {
  if (!p) return "";
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return `${ORIGIN}/${p.replace(/^\/+/, "")}`;
};

export const stripSrc = (link?: string): string => {
  if (!link) return "";
  return link.replace(/^src=/, "");
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${ORIGIN}${path}`;
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export { ORIGIN };